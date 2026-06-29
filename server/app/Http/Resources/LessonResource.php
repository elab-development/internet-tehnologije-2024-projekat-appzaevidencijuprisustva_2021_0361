<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'teaching_plan_id' => $this->teaching_plan_id,
            'title' => $this->title,
            'description' => $this->description,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'teaching_plan' => new TeachingPlanResource($this->whenLoaded('teachingPlan')),
            'users' => UserResource::collection($this->whenLoaded('users')),
            'lesson_users' => LessonUserResource::collection($this->whenLoaded('lessonUsers')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
