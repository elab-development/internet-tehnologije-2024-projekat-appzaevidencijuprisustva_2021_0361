import { formatDateTime } from '../../lib/formatters.js';

function professorNames(lesson) {
  const names = lesson.lesson_users?.map((lessonUser) => lessonUser.user?.name).filter(Boolean) ?? [];

  return names.length > 0 ? names.join(', ') : '-';
}

function LessonList({ isLoading, lessons, onCreate, onDelete, onEdit, teachingPlan }) {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-950">Lessons for {teachingPlan.title}</h3>
          <p className="text-sm text-slate-500">Manage lesson dates and assigned professors.</p>
        </div>
        <button
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          type="button"
          onClick={() => onCreate(teachingPlan)}
        >
          New lesson
        </button>
      </div>

      {isLoading ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500">Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-sm text-slate-500">
          No lessons for this teaching plan yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lesson
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Professors
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="px-4 py-3 align-top">
                    <p className="font-semibold text-slate-950">{lesson.title}</p>
                    {lesson.description && (
                      <p className="mt-1 text-sm text-slate-500">{lesson.description}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-slate-600">
                    <span className="block">{formatDateTime(lesson.starts_at)}</span>
                    <span className="block text-slate-400">{formatDateTime(lesson.ends_at)}</span>
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-slate-600">
                    {professorNames(lesson)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        type="button"
                        onClick={() => onEdit(teachingPlan, lesson)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                        type="button"
                        onClick={() => onDelete(lesson)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LessonList;
