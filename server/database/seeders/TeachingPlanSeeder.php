<?php

namespace Database\Seeders;

use App\Models\TeachingPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeachingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'title' => 'Web Development Fundamentals',
                'description' => 'A practical introduction to HTML, CSS, JavaScript, and basic web application structure.',
            ],
            [
                'title' => 'Database Design',
                'description' => 'Relational database concepts, data modeling, migrations, constraints, and query basics.',
            ],
            [
                'title' => 'Backend API Development',
                'description' => 'Building JSON APIs with authentication, validation, resources, and clean request handling.',
            ],
            [
                'title' => 'Frontend Application Architecture',
                'description' => 'React application structure, routing, state management, API communication, and UI workflows.',
            ],
        ];

        foreach ($plans as $plan) {
            TeachingPlan::updateOrCreate(
                ['title' => $plan['title']],
                ['description' => $plan['description']],
            );
        }
    }
}
