import { useCallback, useState } from 'react';
import { dateTimeLocalValue } from '../../lib/formatters.js';
import { useUserStore } from '../../stores/useUserStore.js';
import UserSearchSelect from '../users/UserSearchSelect.jsx';

function userIdsFromLesson(lesson) {
  return lesson?.lesson_users?.map((lessonUser) => lessonUser.user_id) ?? [];
}

function LessonForm({
  isLoading = false,
  lesson = null,
  onCancel,
  onSubmit,
  teachingPlan,
  validationErrors = {},
}) {
  const users = useUserStore((state) => state.users);
  const usersLoading = useUserStore((state) => state.isLoading);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const [form, setForm] = useState({
    title: lesson?.title ?? '',
    description: lesson?.description ?? '',
    starts_at: dateTimeLocalValue(lesson?.starts_at),
    ends_at: dateTimeLocalValue(lesson?.ends_at),
    user_ids: userIdsFromLesson(lesson),
  });

  const searchUsers = useCallback(
    (search) => {
      fetchUsers({
        search,
        role: 'user',
        per_page: 20,
        sort_by: 'name',
        sort_direction: 'asc',
      }).catch(() => {
        // The user store keeps the API error state for the dropdown.
      });
    },
    [fetchUsers],
  );

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function updateUsers(userIds) {
    setForm((current) => ({
      ...current,
      user_ids: userIds,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      teaching_plan_id: teachingPlan.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      starts_at: form.starts_at,
      ends_at: form.ends_at,
      user_ids: form.user_ids,
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
          className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          name="description"
          value={form.description}
          onChange={updateField}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          <span>Starts at</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            type="datetime-local"
            name="starts_at"
            value={form.starts_at}
            onChange={updateField}
            required
          />
          {validationErrors.starts_at && (
            <span className="text-sm font-medium text-red-600">
              {validationErrors.starts_at[0]}
            </span>
          )}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          <span>Ends at</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            type="datetime-local"
            name="ends_at"
            value={form.ends_at}
            onChange={updateField}
            required
          />
          {validationErrors.ends_at && (
            <span className="text-sm font-medium text-red-600">{validationErrors.ends_at[0]}</span>
          )}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        <span>Professors</span>
        <UserSearchSelect
          users={users}
          selectedUserIds={form.user_ids}
          onChange={updateUsers}
          onSearch={searchUsers}
          isLoading={usersLoading}
        />
        {(validationErrors.user_ids || validationErrors.user_id) && (
          <span className="text-sm font-medium text-red-600">
            {(validationErrors.user_ids ?? validationErrors.user_id)[0]}
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
          disabled={isLoading || form.user_ids.length === 0}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default LessonForm;
