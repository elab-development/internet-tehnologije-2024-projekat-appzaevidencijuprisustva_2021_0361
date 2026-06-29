import { formatDateTime } from '../../lib/formatters.js';

function TeachingPlanTable({ onDelete, onEdit, teachingPlans }) {
  if (teachingPlans.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No teaching plans found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {teachingPlans.map((teachingPlan) => (
              <tr key={teachingPlan.id}>
                <td className="px-4 py-4 align-top">
                  <p className="font-semibold text-slate-950">{teachingPlan.title}</p>
                </td>
                <td className="max-w-md px-4 py-4 align-top text-sm text-slate-600">
                  {teachingPlan.description || '-'}
                </td>
                <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-slate-500">
                  {formatDateTime(teachingPlan.created_at)}
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      type="button"
                      onClick={() => onEdit(teachingPlan)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      type="button"
                      onClick={() => onDelete(teachingPlan)}
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
    </div>
  );
}

export default TeachingPlanTable;
