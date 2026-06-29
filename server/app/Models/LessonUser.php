<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonUser extends Model
{
    use HasFactory;

    public const STATUS_ASSIGNED = 'assigned';

    public const STATUS_PRESENT = 'present';

    public const STATUS_ABSENT = 'absent';

    protected $table = 'lesson_user';

    protected $fillable = [
        'lesson_id',
        'user_id',
        'status',
        'checked_in_at',
    ];

    protected function casts(): array
    {
        return [
            'checked_in_at' => 'datetime',
        ];
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
