<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\TeachingPlan;
use Carbon\CarbonImmutable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topics = [
            'Web Development Fundamentals' => [
                'HTML Document Structure',
                'Semantic HTML and Accessibility',
                'CSS Layout Essentials',
                'Responsive Web Pages',
                'JavaScript Functions and Events',
                'DOM Manipulation Basics',
                'Forms and Client Validation',
                'Web Project Review',
            ],
            'Database Design' => [
                'Relational Data Modeling',
                'Primary and Foreign Keys',
                'Database Normalization',
                'Indexes and Query Performance',
                'Filtering and Aggregation Queries',
                'Database Constraints',
                'Migration Planning',
                'Data Integrity Review',
            ],
            'Backend API Development' => [
                'REST API Basics',
                'Request Validation and Resources',
                'Authentication with Tokens',
                'API Error Handling',
                'Pagination and Filtering',
                'Authorization Rules',
                'Testing API Endpoints',
                'Backend Integration Review',
            ],
            'Frontend Application Architecture' => [
                'React Components and Props',
                'Client Side Routing',
                'State Management with Stores',
                'Connecting Frontend and Backend',
                'Protected Routes',
                'Reusable Form Components',
                'Loading and Error States',
                'Frontend Integration Review',
            ],
        ];

        $schedule = [
            ['plan' => 'Web Development Fundamentals', 'time' => '09:00:00'],
            ['plan' => 'Database Design', 'time' => '10:45:00'],
            ['plan' => 'Backend API Development', 'time' => '12:30:00'],
            ['plan' => 'Frontend Application Architecture', 'time' => '14:15:00'],
        ];

        $teachingPlans = TeachingPlan::whereIn('title', array_keys($topics))
            ->get()
            ->keyBy('title');

        Lesson::whereIn('teaching_plan_id', $teachingPlans->pluck('id'))->delete();

        $topicCounters = array_fill_keys(array_keys($topics), 0);
        $date = CarbonImmutable::parse('2026-06-19');
        $endDate = CarbonImmutable::parse('2026-12-31');
        $week = 0;

        while ($date->lessThanOrEqualTo($endDate)) {
            $slot = $schedule[$week % count($schedule)];
            $this->createScheduledLesson($teachingPlans[$slot['plan']], $topics, $topicCounters, $date, $slot['time']);

            $date = $date->addWeek();
            $week++;
        }

        $finalPlan = $teachingPlans['Frontend Application Architecture'];
        Lesson::updateOrCreate(
            [
                'teaching_plan_id' => $finalPlan->id,
                'title' => 'Year End Learning Showcase',
            ],
            [
                'description' => 'Final lesson for the yearly classroom schedule.',
                'starts_at' => CarbonImmutable::parse('2026-12-31 10:00:00'),
                'ends_at' => CarbonImmutable::parse('2026-12-31 11:30:00'),
            ],
        );
    }

    private function createScheduledLesson(
        TeachingPlan $teachingPlan,
        array $topics,
        array &$topicCounters,
        CarbonImmutable $date,
        string $time
    ): void {
        $planTopics = $topics[$teachingPlan->title];
        $topicIndex = $topicCounters[$teachingPlan->title] % count($planTopics);
        $title = $planTopics[$topicIndex];
        $startsAt = CarbonImmutable::parse($date->toDateString().' '.$time);

        Lesson::updateOrCreate(
            [
                'teaching_plan_id' => $teachingPlan->id,
                'title' => $title,
            ],
            [
                'description' => "Weekly lesson for {$teachingPlan->title}.",
                'starts_at' => $startsAt,
                'ends_at' => $startsAt->addMinutes(90),
            ],
        );

        $topicCounters[$teachingPlan->title]++;
    }
}
