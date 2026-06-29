function PaginationControls({ onPageChange, pagination }) {
  const isFirstPage = pagination.currentPage <= 1;
  const isLastPage = pagination.currentPage >= pagination.lastPage;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {pagination.count} of {pagination.total} teaching plans
      </p>
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={isFirstPage}
        >
          Previous
        </button>
        <span className="px-2 font-semibold text-slate-700">
          Page {pagination.currentPage} of {pagination.lastPage}
        </span>
        <button
          className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={isLastPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
