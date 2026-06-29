<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\LessonUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LessonUser>
 */
class LessonUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lesson_id' => Lesson::factory(),
            'user_id' => User::factory(),
            'status' => LessonUser::STATUS_ASSIGNED,
            'checked_in_at' => null,
        ];
    }
}
