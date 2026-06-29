<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\TeachingPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lesson>
 */
class LessonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = fake()->dateTimeBetween('2026-06-19 08:00:00', '2026-12-31 16:00:00');
        $endsAt = (clone $startsAt)->modify('+90 minutes');

        return [
            'teaching_plan_id' => TeachingPlan::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
        ];
    }
}
