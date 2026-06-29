<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\LessonUser;
use App\Models\User;
use Illuminate\Database\Seeder;

class LessonUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = User::where('role', User::ROLE_USER)
            ->orderBy('name')
            ->get();

        if ($teachers->isEmpty()) {
            return;
        }

        $planTitles = [
            'Web Development Fundamentals',
            'Database Design',
            'Backend API Development',
            'Frontend Application Architecture',
        ];

        foreach ($planTitles as $planIndex => $planTitle) {
            $lessons = Lesson::whereHas('teachingPlan', function ($query) use ($planTitle): void {
                $query->where('title', $planTitle);
            })
                ->orderBy('starts_at')
                ->get();

            foreach ($lessons as $index => $lesson) {
                $primaryTeacher = $teachers[($planIndex + $index) % $teachers->count()];
                $this->assignTeacher($lesson, $primaryTeacher);

                if ($teachers->count() > 1 && $index % 3 === 0) {
                    $assistantTeacher = $teachers[($planIndex + $index + 1) % $teachers->count()];
                    $this->assignTeacher($lesson, $assistantTeacher);
                }
            }
        }
    }

    private function assignTeacher(Lesson $lesson, User $teacher): void
    {
        LessonUser::updateOrCreate(
            [
                'lesson_id' => $lesson->id,
                'user_id' => $teacher->id,
            ],
            [
                'status' => LessonUser::STATUS_ASSIGNED,
                'checked_in_at' => null,
            ],
        );
    }
}
