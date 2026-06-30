import { monthLabel } from '../../lib/calendar.js';

function CalendarControls({
  currentMonth,
  onNextMonth,
  onPreviousMonth,
  onTeachingPlanChange,
  selectedTeachingPlanId,
  teachingPlans,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Calendar</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{monthLabel(currentMonth)}</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          <span>Teaching plan</span>
          <select
            className="min-w-64 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            value={selectedTeachingPlanId}
            onChange={(event) => onTeachingPlanChange(event.target.value)}
          >
            <option value="">All teaching plans</option>
            {teachingPlans.map((teachingPlan) => (
              <option key={teachingPlan.id} value={teachingPlan.id}>
                {teachingPlan.title}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-2">
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={onPreviousMonth}
          >
            Previous
          </button>
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
            onClick={onNextMonth}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarControls;
