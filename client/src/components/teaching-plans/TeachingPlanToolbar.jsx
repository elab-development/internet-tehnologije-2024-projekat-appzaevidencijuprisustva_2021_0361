function TeachingPlanToolbar({ filters, onCreate, onFiltersChange, onSearch }) {
  function updateFilter(event) {
    onFiltersChange({
      ...filters,
      [event.target.name]: event.target.value,
      page: 1,
    });
  }

  function submitSearch(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:items-end lg:justify-between">
      <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={submitSearch}>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          <span>Search</span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            name="search"
            value={filters.search}
            onChange={updateFilter}
            placeholder="Search teaching plans"
          />
        </label>
        <button
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 sm:self-end"
          type="submit"
        >
          Apply
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          <span>Sort by</span>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            name="sort_by"
            value={filters.sort_by}
            onChange={updateFilter}
          >
            <option value="created_at">Created</option>
            <option value="updated_at">Updated</option>
            <option value="title">Title</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          <span>Direction</span>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            name="sort_direction"
            value={filters.sort_direction}
            onChange={updateFilter}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>
        <button
          className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          type="button"
          onClick={onCreate}
        >
          New teaching plan
        </button>
      </div>
    </div>
  );
}

export default TeachingPlanToolbar;
