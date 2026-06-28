<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'email' => 'admin@e-classroom.test',
                'name' => 'Administrator',
                'role' => 'admin',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make('password'),
                    'role' => $user['role'],
                ],
            );
        }

        $teachers = [
            [
                'name' => 'Sarah Mitchell',
                'email' => 'sarah.mitchell@e-classroom.test',
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david.wilson@e-classroom.test',
            ],
            [
                'name' => 'Emily Parker',
                'email' => 'emily.parker@e-classroom.test',
            ],
        ];

        foreach ($teachers as $teacher) {
            if (User::where('email', $teacher['email'])->exists()) {
                continue;
            }

            User::factory()->create([
                'name' => $teacher['name'],
                'email' => $teacher['email'],
                'role' => User::ROLE_USER,
            ]);
        }
    }
}
