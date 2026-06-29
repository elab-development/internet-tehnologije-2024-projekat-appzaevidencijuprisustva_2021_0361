<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeachingPlanResource;
use App\Models\TeachingPlan;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TeachingPlanController extends Controller
{
    private const SORTABLE_FIELDS = [
        'title',
        'created_at',
        'updated_at',
    ];

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'string', 'max:255'],
            'sort_by' => ['sometimes', Rule::in(self::SORTABLE_FIELDS)],
            'sort_direction' => ['sometimes', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';
        $perPage = (int) ($validated['per_page'] ?? 10);

        $query = TeachingPlan::query()->with('lessons');

        if (! empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($query) use ($search): void {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $teachingPlans = $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'count' => $teachingPlans->count(),
            'total' => $teachingPlans->total(),
            'per_page' => $teachingPlans->perPage(),
            'current_page' => $teachingPlans->currentPage(),
            'last_page' => $teachingPlans->lastPage(),
            'sort' => [
                'by' => $sortBy,
                'direction' => $sortDirection,
            ],
            'filters' => $request->only('search'),
            'teaching_plans' => TeachingPlanResource::collection($teachingPlans->getCollection()),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:teaching_plans,title'],
            'description' => ['nullable', 'string'],
        ]);

        $teachingPlan = TeachingPlan::create($validated);

        return response()->json([
            'message' => 'Teaching plan created successfully.',
            'teaching_plan' => new TeachingPlanResource($teachingPlan),
        ], 201);
    }

    public function show(TeachingPlan $teachingPlan): JsonResponse
    {
        return response()->json([
            'teaching_plan' => new TeachingPlanResource($teachingPlan->load('lessons')),
        ]);
    }

    public function update(Request $request, TeachingPlan $teachingPlan): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('teaching_plans', 'title')->ignore($teachingPlan->id),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
        ]);

        if ($validated === []) {
            return response()->json([
                'message' => 'Nothing to update.',
                'teaching_plan' => new TeachingPlanResource($teachingPlan),
            ]);
        }

        $teachingPlan->update($validated);

        return response()->json([
            'message' => 'Teaching plan updated successfully.',
            'teaching_plan' => new TeachingPlanResource($teachingPlan->refresh()),
        ]);
    }

    public function destroy(Request $request, TeachingPlan $teachingPlan): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $teachingPlan->delete();

        return response()->json([
            'message' => 'Teaching plan deleted successfully.',
        ]);
    }

    private function isAdmin(Request $request): bool
    {
        return $request->user()?->role === User::ROLE_ADMIN;
    }
}
