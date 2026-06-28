<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private const SORTABLE_FIELDS = [
        'name',
        'email',
        'role',
        'created_at',
    ];

    public function index(Request $request): JsonResponse
    {
        if (! $this->isAdmin($request)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'search' => ['sometimes', 'string', 'max:255'],
            'role' => ['sometimes', Rule::in([User::ROLE_ADMIN, User::ROLE_USER])],
            'sort_by' => ['sometimes', Rule::in(self::SORTABLE_FIELDS)],
            'sort_direction' => ['sometimes', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $sortBy = $validated['sort_by'] ?? 'name';
        $sortDirection = $validated['sort_direction'] ?? 'asc';
        $perPage = (int) ($validated['per_page'] ?? 10);

        $query = User::query();

        if (! empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (isset($validated['role'])) {
            $query->where('role', $validated['role']);
        }

        $users = $query
            ->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'count' => $users->count(),
            'total' => $users->total(),
            'per_page' => $users->perPage(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'sort' => [
                'by' => $sortBy,
                'direction' => $sortDirection,
            ],
            'filters' => $request->only(['search', 'role']),
            'users' => UserResource::collection($users->getCollection()),
        ]);
    }

    private function isAdmin(Request $request): bool
    {
        return $request->user()?->role === User::ROLE_ADMIN;
    }
}
