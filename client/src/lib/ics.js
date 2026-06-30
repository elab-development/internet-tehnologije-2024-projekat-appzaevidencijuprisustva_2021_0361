function pad(value) {
  return String(value).padStart(2, '0');
}

function formatIcsDate(value) {
  const date = new Date(value);

  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    'T',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    'Z',
  ].join('');
}

function escapeIcsText(value = '') {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll(/\r?\n/g, '\\n');
}

function safeFilename(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '');
}

function lessonDescription(lesson) {
  return [lesson.description, lesson.teaching_plan?.title && `Teaching plan: ${lesson.teaching_plan.title}`]
    .filter(Boolean)
    .join('\n\n');
}

export function lessonToIcs(lesson) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//E Classroom//Lessons//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:e-classroom-lesson-${lesson.id}@local`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(lesson.starts_at)}`,
    `DTEND:${formatIcsDate(lesson.ends_at)}`,
    `SUMMARY:${escapeIcsText(lesson.title)}`,
    `DESCRIPTION:${escapeIcsText(lessonDescription(lesson))}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadLessonIcs(lesson) {
  const content = lessonToIcs(lesson);
  const filename = `${safeFilename(lesson.title) || 'lesson'}-${formatIcsDate(lesson.starts_at).slice(
    0,
    8,
  )}.ics`;
  const blob = new Blob([content], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
