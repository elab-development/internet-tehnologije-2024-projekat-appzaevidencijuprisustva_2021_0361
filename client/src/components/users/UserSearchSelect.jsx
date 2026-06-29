import { useEffect, useMemo, useState } from 'react';

function UserSearchSelect({ isLoading = false, onChange, onSearch, selectedUserIds, users }) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    onSearch(search);
  }, [onSearch, search]);

  const selectedUsers = useMemo(
    () => users.filter((user) => selectedUserIds.includes(user.id)),
    [selectedUserIds, users],
  );

  function toggleUser(userId) {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId));
      return;
    }

    onChange([...selectedUserIds, userId]);
  }

  return (
    <div className="grid gap-2">
      <input
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search users by name or email"
      />

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <span
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              key={user.id}
            >
              {user.name}
            </span>
          ))}
        </div>
      )}

      <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <p className="px-3 py-3 text-sm text-slate-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="px-3 py-3 text-sm text-slate-500">No users found.</p>
        ) : (
          users.map((user) => (
            <label
              className="flex cursor-pointer items-start gap-3 border-b border-slate-100 px-3 py-2 last:border-b-0 hover:bg-slate-50"
              key={user.id}
            >
              <input
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => toggleUser(user.id)}
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">{user.name}</span>
                <span className="block text-xs text-slate-500">{user.email}</span>
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

export default UserSearchSelect;
