import {
  attendanceForUser,
  calendarDays,
  dateKey,
  groupLessonsByDate,
  lessonTimeRange,
  weekDays,
} from '../../lib/calendar.js';

function lessonCardClass(status) {
  if (status === 'present') {
    return 'border-green-200 bg-green-50 text-green-950';
  }

  if (status === 'absent') {
    return 'border-red-200 bg-red-50 text-red-950';
  }

  return 'border-blue-100 bg-blue-50 text-blue-950';
}

function mutedTextClass(status) {
  if (status === 'present') {
    return 'text-green-700';
  }

  if (status === 'absent') {
    return 'text-red-700';
  }

  return 'text-blue-700';
}

function MonthCalendar({ currentMonth, currentUserId, lessons }) {
  const days = calendarDays(currentMonth);
  const lessonsByDate = groupLessonsByDate(lessons);
  const todayKey = dateKey(new Date());

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {weekDays.map((weekDay) => (
          <div
            className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500"
            key={weekDay}
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-7 sm:divide-x sm:divide-y-0">
        {days.map((day, index) => {
          const key = day ? dateKey(day) : `empty-${index}`;
          const dayKey = day ? dateKey(day) : null;
          const dayLessons = dayKey ? lessonsByDate[dayKey] ?? [] : [];
          const isToday = day && dateKey(day) === todayKey;

          return (
            <div
              className={[
                'min-h-36 p-3',
                day ? 'bg-white' : 'hidden bg-slate-50 sm:block',
                isToday ? 'ring-2 ring-inset ring-blue-500' : '',
              ].join(' ')}
              key={key}
            >
              {day && (
                <>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span
                      className={[
                        'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                        isToday ? 'bg-blue-600 text-white' : 'text-slate-700',
                      ].join(' ')}
                    >
                      {day.getDate()}
                    </span>
                    {dayLessons.length > 0 && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {dayLessons.length}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    {dayLessons.map((lesson) => (
                      <LessonCalendarCard
                        key={lesson.id}
                        lesson={lesson}
                        currentUserId={currentUserId}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LessonCalendarCard({ currentUserId, lesson }) {
  const attendance = attendanceForUser(lesson, currentUserId);
  const status = attendance?.status ?? 'assigned';
  const cardToneClass = lessonCardClass(status);
  const mutedClass = mutedTextClass(status);

  return (
    <article className={['rounded-lg border p-2 text-xs', cardToneClass].join(' ')}>
      <p className="font-semibold">{lesson.title}</p>
      <p className={['mt-1', mutedClass].join(' ')}>{lessonTimeRange(lesson)}</p>
      <p className="mt-1 text-slate-500">{lesson.teaching_plan?.title}</p>
      <p className={['mt-2 font-semibold', mutedClass].join(' ')}>Status: {status}</p>
    </article>
  );
}

export default MonthCalendar;
