export function attendanceStatusForUser(lesson, userId) {
  return (
    lesson.lesson_users?.find((lessonUser) => Number(lessonUser.user_id) === Number(userId))
      ?.status ?? 'assigned'
  );
}

export function lessonStatsForUser(lessons, userId) {
  return lessons.reduce(
    (stats, lesson) => {
      const status = attendanceStatusForUser(lesson, userId);

      if (status === 'present') {
        return { ...stats, present: stats.present + 1 };
      }

      if (status === 'absent') {
        return { ...stats, absent: stats.absent + 1 };
      }

      return { ...stats, pending: stats.pending + 1 };
    },
    {
      total: lessons.length,
      present: 0,
      absent: 0,
      pending: 0,
    },
  );
}
