<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeachingPlanController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/users', [UserController::class, 'index']);
    Route::apiResource('teaching-plans', TeachingPlanController::class);
});
