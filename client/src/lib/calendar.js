const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function pad(value) {
  return String(value).padStart(2, '0');
}

export function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isTodayOrPast(value) {
  return dateKey(new Date(value)) <= dateKey(new Date());
}

export function apiDateTime(date, endOfDay = false) {
  return `${dateKey(date)} ${endOfDay ? '23:59:59' : '00:00:00'}`;
}

export function monthLabel(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function addMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

export function monthRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { start, end };
}

export function calendarDays(date) {
  const { start, end } = monthRange(date);
  const leadingDays = (start.getDay() + 6) % 7;
  const days = [];

  for (let index = 0; index < leadingDays; index++) {
    days.push(null);
  }

  for (let day = 1; day <= end.getDate(); day++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

export function groupLessonsByDate(lessons) {
  return lessons.reduce((grouped, lesson) => {
    const key = dateKey(new Date(lesson.starts_at));

    return {
      ...grouped,
      [key]: [...(grouped[key] ?? []), lesson],
    };
  }, {});
}

export function lessonTimeRange(lesson) {
  const formatter = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${formatter.format(new Date(lesson.starts_at))} - ${formatter.format(new Date(lesson.ends_at))}`;
}

export function attendanceForUser(lesson, userId) {
  return lesson.lesson_users?.find((lessonUser) => Number(lessonUser.user_id) === Number(userId));
}

export { weekDays };
