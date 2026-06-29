import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import PaginationControls from '../components/teaching-plans/PaginationControls.jsx';
import TeachingPlanForm from '../components/teaching-plans/TeachingPlanForm.jsx';
import TeachingPlanTable from '../components/teaching-plans/TeachingPlanTable.jsx';
import TeachingPlanToolbar from '../components/teaching-plans/TeachingPlanToolbar.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useTeachingPlanStore } from '../stores/useTeachingPlanStore.js';

const initialQuery = {
  search: '',
  sort_by: 'created_at',
  sort_direction: 'desc',
  per_page: 10,
  page: 1,
};

function AdminDashboardPage() {
  const teachingPlans = useTeachingPlanStore((state) => state.teachingPlans);
  const pagination = useTeachingPlanStore((state) => state.pagination);
  const isLoading = useTeachingPlanStore((state) => state.isLoading);
  const error = useTeachingPlanStore((state) => state.error);
  const validationErrors = useTeachingPlanStore((state) => state.validationErrors);
  const fetchTeachingPlans = useTeachingPlanStore((state) => state.fetchTeachingPlans);
  const createTeachingPlan = useTeachingPlanStore((state) => state.createTeachingPlan);
  const updateTeachingPlan = useTeachingPlanStore((state) => state.updateTeachingPlan);
  const deleteTeachingPlan = useTeachingPlanStore((state) => state.deleteTeachingPlan);
  const clearError = useTeachingPlanStore((state) => state.clearError);
  const [filters, setFilters] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [formTeachingPlan, setFormTeachingPlan] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teachingPlanToDelete, setTeachingPlanToDelete] = useState(null);

  useEffect(() => {
    fetchTeachingPlans(query).catch(() => {
      // The store keeps the API error state for the page.
    });
  }, [fetchTeachingPlans, query]);

  function openCreateModal() {
    clearError();
    setFormTeachingPlan(null);
    setIsFormOpen(true);
  }

  function openEditModal(teachingPlan) {
    clearError();
    setFormTeachingPlan(teachingPlan);
    setIsFormOpen(true);
  }

  function closeFormModal() {
    clearError();
    setIsFormOpen(false);
    setFormTeachingPlan(null);
  }

  async function handleFormSubmit(payload) {
    if (formTeachingPlan) {
      await updateTeachingPlan(formTeachingPlan.id, payload);
    } else {
      await createTeachingPlan(payload);
    }

    closeFormModal();
    await fetchTeachingPlans(query);
  }

  function handleSearch() {
    setQuery(filters);
  }

  function handlePageChange(page) {
    const nextQuery = {
      ...query,
      page,
    };

    setFilters(nextQuery);
    setQuery(nextQuery);
  }

  async function confirmDeleteTeachingPlan() {
    if (!teachingPlanToDelete) {
      return;
    }

    await deleteTeachingPlan(teachingPlanToDelete.id);
    setTeachingPlanToDelete(null);
    await fetchTeachingPlans(query);
  }

  return (
    <section className="grid gap-6">
      {isLoading && <LoadingOverlay label="Loading admin data..." />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">E Classroom</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-slate-600">Manage teaching plans for the classroom schedule.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <TeachingPlanToolbar
        filters={filters}
        onCreate={openCreateModal}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
      />

      <TeachingPlanTable
        teachingPlans={teachingPlans}
        onEdit={openEditModal}
        onDelete={setTeachingPlanToDelete}
      />

      <PaginationControls pagination={pagination} onPageChange={handlePageChange} />

      <Modal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        title={formTeachingPlan ? 'Edit teaching plan' : 'Create teaching plan'}
      >
        <TeachingPlanForm
          key={formTeachingPlan?.id ?? 'create'}
          teachingPlan={formTeachingPlan}
          validationErrors={validationErrors}
          isLoading={isLoading}
          onCancel={closeFormModal}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(teachingPlanToDelete)}
        isLoading={isLoading}
        title="Delete teaching plan?"
        message={`Are you sure you want to delete "${teachingPlanToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setTeachingPlanToDelete(null)}
        onConfirm={confirmDeleteTeachingPlan}
      />
    </section>
  );
}

export default AdminDashboardPage;
