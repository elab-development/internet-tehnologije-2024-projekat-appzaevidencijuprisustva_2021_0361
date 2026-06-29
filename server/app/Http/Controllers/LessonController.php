<?php

namespace App\Http\Controllers;

use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use App\Models\LessonUser;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class LessonController extends Controller
{
    private const SORTABLE_FIELDS = [
        'title',
        'starts_at',
        'ends_at',
        'created_at',
        'updated_at',
    ];

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'string', 'max:255'],
            'teaching_plan_id' => ['sometimes', 'integer', 'exists:teaching_plans,id'],
            'starts_from' => ['sometimes', 'date'],
            'starts_until' => ['sometimes', 'date'],
            'sort_by' => ['sometimes', Rule::in(self::SORTABLE_FIELDS)],
            'sort_direction' => ['sometimes', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $user = $request->user();
        $sortBy = $validated['sort_by'] ?? 'starts_at';
        $sortDirection = $validated['sort_direction'] ?? 'asc';
        $perPage = (int) ($validated['per_page'] ?? 10);

        $query = Lesson::query()
            ->with(['teachingPlan', 'lessonUsers.user']);

        if (! $this->isAdmin($request)) {
            $query->whereHas('users', function ($query) use ($user): void {
                $query->where('users.id', $user->id);
            });
        }

        if (! empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($query) use ($search): void {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('teachingPlan', function ($query) use ($search): void {
                        $query->where('title', 'like', "%{$search}%");
                    });
            });
        }

        if (isset($validated['teaching_plan_id'])) {
            $query->where('teaching_plan_id', $validated['teaching_plan_id']);
        }

        if (isset($validated['starts_from'])) {
            $query->where('starts_at', '>=', $validated['starts_from']);
        }

        if (isset($validated['starts_until'])) {
            $query->where('starts_at', '<=', $validated['starts_until']);
        }

        $lessons = $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'count' => $lessons->count(),
            'total' => $lessons->total(),
            'per_page' => $lessons->perPage(),
            'current_page' => $lessons->currentPage(),
            'last_page' => $lessons->lastPage(),
            'sort' => [
                'by' => $sortBy,
                'direction' => $sortDirection,
            ],
            'filters' => $request->only([
                'search',
                'teaching_plan_id',
                'starts_from',
                'starts_until',
            ]),
            'lessons' => LessonResource::collection($lessons->getCollection()),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate($this->rules());
        $userIds = $this->assignmentUserIds($validated);

        $lesson = DB::transaction(function () use ($validated, $userIds): Lesson {
            $lesson = Lesson::create($this->lessonAttributes($validated));
            $this->syncAssignedUsers($lesson, $userIds);

            return $lesson;
        });

        return response()->json([
            'message' => 'Lesson created successfully.',
            'lesson' => new LessonResource($lesson->load(['teachingPlan', 'lessonUsers.user'])),
        ], 201);
    }

    public function show(Request $request, Lesson $lesson): JsonResponse
    {
        if (! $this->canView($request, $lesson)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'lesson' => new LessonResource($lesson->load(['teachingPlan', 'lessonUsers.user'])),
        ]);
    }

    public function update(Request $request, Lesson $lesson): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate($this->rules(isUpdate: true));
        $lessonAttributes = $this->lessonAttributes($validated);
        $hasAssignments = array_key_exists('user_id', $validated) || array_key_exists('user_ids', $validated);

        if ($lessonAttributes === [] && ! $hasAssignments) {
            return response()->json([
                'message' => 'Nothing to update.',
                'lesson' => new LessonResource($lesson->load(['teachingPlan', 'lessonUsers.user'])),
            ]);
        }

        DB::transaction(function () use ($lesson, $lessonAttributes, $hasAssignments, $validated): void {
            if ($lessonAttributes !== []) {
                $lesson->update($lessonAttributes);
            }

            if ($hasAssignments) {
                $this->syncAssignedUsers($lesson, $this->assignmentUserIds($validated));
            }
        });

        return response()->json([
            'message' => 'Lesson updated successfully.',
            'lesson' => new LessonResource($lesson->refresh()->load(['teachingPlan', 'lessonUsers.user'])),
        ]);
    }

    public function destroy(Request $request, Lesson $lesson): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $lesson->delete();

        return response()->json([
            'message' => 'Lesson deleted successfully.',
        ]);
    }

    public function updateAttendance(Request $request, Lesson $lesson): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([LessonUser::STATUS_PRESENT, LessonUser::STATUS_ABSENT])],
        ]);

        $lessonUser = LessonUser::where('lesson_id', $lesson->id)
            ->where('user_id', $request->user()?->id)
            ->first();

        if (! $lessonUser) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($lesson->starts_at->toDateString() > Carbon::today()->toDateString()) {
            return response()->json([
                'message' => 'Attendance can only be marked for today or past lessons.',
            ], 422);
        }

        $lessonUser->update([
            'status' => $validated['status'],
            'checked_in_at' => now(),
        ]);

        return response()->json([
            'message' => 'Attendance updated successfully.',
            'lesson' => new LessonResource($lesson->refresh()->load(['teachingPlan', 'lessonUsers.user'])),
        ]);
    }

    private function rules(bool $isUpdate = false): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'teaching_plan_id' => [$required, 'integer', 'exists:teaching_plans,id'],
            'title' => [$required, 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'starts_at' => [$required, 'date'],
            'ends_at' => [$required, 'date', 'after:starts_at'],
            'user_id' => [$isUpdate ? 'sometimes' : 'required_without:user_ids', 'nullable', 'integer', 'exists:users,id'],
            'user_ids' => [$isUpdate ? 'sometimes' : 'required_without:user_id', 'array', 'min:1'],
            'user_ids.*' => ['integer', 'distinct', 'exists:users,id'],
        ];
    }

    private function lessonAttributes(array $validated): array
    {
        return array_intersect_key($validated, array_flip([
            'teaching_plan_id',
            'title',
            'description',
            'starts_at',
            'ends_at',
        ]));
    }

    private function assignmentUserIds(array $validated): array
    {
        $userIds = $validated['user_ids'] ?? [];

        if (array_key_exists('user_id', $validated) && $validated['user_id'] !== null) {
            $userIds[] = $validated['user_id'];
        }

        return array_values(array_unique($userIds));
    }

    private function syncAssignedUsers(Lesson $lesson, array $userIds): void
    {
        $lesson->users()->syncWithPivotValues($userIds, [
            'status' => LessonUser::STATUS_ASSIGNED,
            'checked_in_at' => null,
        ]);
    }

    private function canView(Request $request, Lesson $lesson): bool
    {
        if ($this->isAdmin($request)) {
            return true;
        }

        return $lesson->users()
            ->where('users.id', $request->user()?->id)
            ->exists();
    }

    private function isAdmin(Request $request): bool
    {
        return $request->user()?->role === User::ROLE_ADMIN;
    }
}
