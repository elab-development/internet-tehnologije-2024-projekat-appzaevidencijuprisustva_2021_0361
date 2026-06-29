import { useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
};

function TeachingPlanForm({
  isLoading = false,
  onCancel,
  onSubmit,
  teachingPlan = null,
  validationErrors = {},
}) {
  const [form, setForm] = useState({
    title: teachingPlan?.title ?? emptyForm.title,
    description: teachingPlan?.description ?? emptyForm.description,
  });

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        <span>Title</span>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          name="title"
          value={form.title}
          onChange={updateField}
          required
        />
        {validationErrors.title && (
          <span className="text-sm font-medium text-red-600">{validationErrors.title[0]}</span>
        )}
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        <span>Description</span>
        <textarea
          className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          name="description"
          value={form.description}
          onChange={updateField}
        />
        {validationErrors.description && (
          <span className="text-sm font-medium text-red-600">
            {validationErrors.description[0]}
          </span>
        )}
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default TeachingPlanForm;
