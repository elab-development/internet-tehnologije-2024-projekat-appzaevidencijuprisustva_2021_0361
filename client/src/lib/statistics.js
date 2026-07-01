import { apiRequest, queryString } from './api.js';

async function fetchAllPages(path, collectionKey, params = {}) {
  const items = [];
  let currentPage = 1;

  while (true) {
    const response = await apiRequest(
      `${path}${queryString({
        ...params,
        per_page: 50,
        page: currentPage,
      })}`,
    );

    items.push(...(response[collectionKey] ?? []));

    if (currentPage >= (response.last_page ?? 1)) {
      break;
    }

    currentPage += 1;
  }

  return items;
}

function countBy(items, keyGetter) {
  return items.reduce((counts, item) => {
    const key = keyGetter(item);

    return {
      ...counts,
      [key]: (counts[key] ?? 0) + 1,
    };
  }, {});
}

function chartDataFromCounts(counts) {
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((first, second) => second.value - first.value);
}

function attendanceStats(lessons) {
  const assignments = lessons.flatMap((lesson) => lesson.lesson_users ?? []);
  const counts = countBy(assignments, (assignment) => assignment.status ?? 'assigned');

  return {
    total: assignments.length,
    present: counts.present ?? 0,
    absent: counts.absent ?? 0,
    pending: counts.assigned ?? 0,
  };
}

function monthLabel(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export async function fetchStatisticsData() {
  const [lessons, teachingPlans, users] = await Promise.all([
    fetchAllPages('/lessons', 'lessons', {
      sort_by: 'starts_at',
      sort_direction: 'asc',
    }),
    fetchAllPages('/teaching-plans', 'teaching_plans', {
      sort_by: 'title',
      sort_direction: 'asc',
    }),
    fetchAllPages('/users', 'users', {
      sort_by: 'name',
      sort_direction: 'asc',
    }),
  ]);

  return { lessons, teachingPlans, users };
}

export function buildStatistics({ lessons, teachingPlans, users }) {
  const attendance = attendanceStats(lessons);
  const professors = users.filter((user) => user.role === 'user');
  const attendanceRate =
    attendance.total > 0 ? Math.round((attendance.present / attendance.total) * 100) : 0;
  const lessonsByTeachingPlan = chartDataFromCounts(
    countBy(lessons, (lesson) => lesson.teaching_plan?.title ?? 'Without teaching plan'),
  );
  const lessonsByMonth = chartDataFromCounts(
    countBy(lessons, (lesson) => monthLabel(lesson.starts_at)),
  ).sort((first, second) => new Date(first.label) - new Date(second.label));

  return {
    summary: {
      lessons: lessons.length,
      teachingPlans: teachingPlans.length,
      professors: professors.length,
      attendanceRate,
    },
    attendance,
    lessonsByTeachingPlan,
    lessonsByMonth,
  };
}
