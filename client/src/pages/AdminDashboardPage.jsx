import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import LessonForm from '../components/lessons/LessonForm.jsx';
import PaginationControls from '../components/teaching-plans/PaginationControls.jsx';
import TeachingPlanForm from '../components/teaching-plans/TeachingPlanForm.jsx';
import TeachingPlanTable from '../components/teaching-plans/TeachingPlanTable.jsx';
import TeachingPlanToolbar from '../components/teaching-plans/TeachingPlanToolbar.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useLessonStore } from '../stores/useLessonStore.js';
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
  const teachingPlansLoading = useTeachingPlanStore((state) => state.isLoading);
  const teachingPlanError = useTeachingPlanStore((state) => state.error);
  const teachingPlanValidationErrors = useTeachingPlanStore((state) => state.validationErrors);
  const fetchTeachingPlans = useTeachingPlanStore((state) => state.fetchTeachingPlans);
  const createTeachingPlan = useTeachingPlanStore((state) => state.createTeachingPlan);
  const updateTeachingPlan = useTeachingPlanStore((state) => state.updateTeachingPlan);
  const deleteTeachingPlan = useTeachingPlanStore((state) => state.deleteTeachingPlan);
  const clearTeachingPlanError = useTeachingPlanStore((state) => state.clearError);
  const lessons = useLessonStore((state) => state.lessons);
  const lessonsLoading = useLessonStore((state) => state.isLoading);
  const lessonError = useLessonStore((state) => state.error);
  const lessonValidationErrors = useLessonStore((state) => state.validationErrors);
  const fetchLessons = useLessonStore((state) => state.fetchLessons);
  const createLesson = useLessonStore((state) => state.createLesson);
  const updateLesson = useLessonStore((state) => state.updateLesson);
  const deleteLesson = useLessonStore((state) => state.deleteLesson);
  const clearLessonError = useLessonStore((state) => state.clearError);
  const [filters, setFilters] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [formTeachingPlan, setFormTeachingPlan] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teachingPlanToDelete, setTeachingPlanToDelete] = useState(null);
  const [expandedTeachingPlanId, setExpandedTeachingPlanId] = useState(null);
  const [lessonTeachingPlan, setLessonTeachingPlan] = useState(null);
  const [formLesson, setFormLesson] = useState(null);
  const [isLessonFormOpen, setIsLessonFormOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const isLoading = teachingPlansLoading || lessonsLoading;
  const error = teachingPlanError || lessonError;

  useEffect(() => {
    fetchTeachingPlans(query).catch(() => {
      // The store keeps the API error state for the page.
    });
  }, [fetchTeachingPlans, query]);

  function openCreateModal() {
    clearTeachingPlanError();
    setFormTeachingPlan(null);
    setIsFormOpen(true);
  }

  function openEditModal(teachingPlan) {
    clearTeachingPlanError();
    setFormTeachingPlan(teachingPlan);
    setIsFormOpen(true);
  }

  function closeFormModal() {
    clearTeachingPlanError();
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

  function lessonQueryForPlan(teachingPlanId) {
    return {
      teaching_plan_id: teachingPlanId,
      sort_by: 'starts_at',
      sort_direction: 'asc',
      per_page: 50,
    };
  }

  async function refreshLessons(teachingPlanId = expandedTeachingPlanId) {
    if (!teachingPlanId) {
      return;
    }

    await fetchLessons(lessonQueryForPlan(teachingPlanId));
  }

  async function toggleLessons(teachingPlan) {
    clearLessonError();

    if (expandedTeachingPlanId === teachingPlan.id) {
      setExpandedTeachingPlanId(null);
      return;
    }

    setExpandedTeachingPlanId(teachingPlan.id);
    await fetchLessons(lessonQueryForPlan(teachingPlan.id));
  }

  function openCreateLessonModal(teachingPlan) {
    clearLessonError();
    setLessonTeachingPlan(teachingPlan);
    setFormLesson(null);
    setIsLessonFormOpen(true);
  }

  function openEditLessonModal(teachingPlan, lesson) {
    clearLessonError();
    setLessonTeachingPlan(teachingPlan);
    setFormLesson(lesson);
    setIsLessonFormOpen(true);
  }

  function closeLessonFormModal() {
    clearLessonError();
    setIsLessonFormOpen(false);
    setLessonTeachingPlan(null);
    setFormLesson(null);
  }

  async function handleLessonFormSubmit(payload) {
    if (formLesson) {
      await updateLesson(formLesson.id, payload);
    } else {
      await createLesson(payload);
    }

    closeLessonFormModal();
    await refreshLessons(payload.teaching_plan_id);
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

  async function confirmDeleteLesson() {
    if (!lessonToDelete) {
      return;
    }

    await deleteLesson(lessonToDelete.id);
    setLessonToDelete(null);
    await refreshLessons();
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
        expandedTeachingPlanId={expandedTeachingPlanId}
        lessons={lessons}
        lessonsLoading={lessonsLoading}
        onEdit={openEditModal}
        onDelete={setTeachingPlanToDelete}
        onToggleLessons={toggleLessons}
        onCreateLesson={openCreateLessonModal}
        onEditLesson={openEditLessonModal}
        onDeleteLesson={setLessonToDelete}
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
          validationErrors={teachingPlanValidationErrors}
          isLoading={teachingPlansLoading}
          onCancel={closeFormModal}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <Modal
        isOpen={isLessonFormOpen}
        onClose={closeLessonFormModal}
        title={formLesson ? 'Edit lesson' : 'Create lesson'}
      >
        {lessonTeachingPlan && (
          <LessonForm
            key={formLesson?.id ?? `create-${lessonTeachingPlan.id}`}
            lesson={formLesson}
            teachingPlan={lessonTeachingPlan}
            validationErrors={lessonValidationErrors}
            isLoading={lessonsLoading}
            onCancel={closeLessonFormModal}
            onSubmit={handleLessonFormSubmit}
          />
        )}
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

      <ConfirmDialog
        isOpen={Boolean(lessonToDelete)}
        isLoading={lessonsLoading}
        title="Delete lesson?"
        message={`Are you sure you want to delete "${lessonToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setLessonToDelete(null)}
        onConfirm={confirmDeleteLesson}
      />
    </section>
  );
}

export default AdminDashboardPage;
