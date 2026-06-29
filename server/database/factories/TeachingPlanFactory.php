<?php

namespace Database\Factories;

use App\Models\TeachingPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeachingPlan>
 */
class TeachingPlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
        ];
    }
}
