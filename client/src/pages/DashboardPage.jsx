import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import CalendarControls from '../components/calendar/CalendarControls.jsx';
import MonthCalendar from '../components/calendar/MonthCalendar.jsx';
import { addMonths, apiDateTime, monthRange } from '../lib/calendar.js';
import { fetchPublicHolidays } from '../lib/publicHolidays.js';
import { useAuthStore } from '../stores/useAuthStore.js';
import { useLessonStore } from '../stores/useLessonStore.js';
import { useTeachingPlanStore } from '../stores/useTeachingPlanStore.js';

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const lessons = useLessonStore((state) => state.lessons);
  const lessonsLoading = useLessonStore((state) => state.isLoading);
  const lessonError = useLessonStore((state) => state.error);
  const fetchLessons = useLessonStore((state) => state.fetchLessons);
  const updateAttendance = useLessonStore((state) => state.updateAttendance);
  const teachingPlans = useTeachingPlanStore((state) => state.teachingPlans);
  const teachingPlansLoading = useTeachingPlanStore((state) => state.isLoading);
  const teachingPlanError = useTeachingPlanStore((state) => state.error);
  const fetchTeachingPlans = useTeachingPlanStore((state) => state.fetchTeachingPlans);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();

    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedTeachingPlanId, setSelectedTeachingPlanId] = useState('');
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [holidaysLoading, setHolidaysLoading] = useState(false);
  const [holidayError, setHolidayError] = useState(null);
  const isLoading = lessonsLoading || teachingPlansLoading || holidaysLoading;
  const error = lessonError || teachingPlanError;

  async function handleAttendanceChange(lessonId, status) {
    await updateAttendance(lessonId, status);
  }

  useEffect(() => {
    fetchTeachingPlans({
      sort_by: 'title',
      sort_direction: 'asc',
      per_page: 50,
    }).catch(() => {});
  }, [fetchTeachingPlans]);

  useEffect(() => {
    const { start, end } = monthRange(currentMonth);

    fetchLessons({
      starts_from: apiDateTime(start),
      starts_until: apiDateTime(end, true),
      teaching_plan_id: selectedTeachingPlanId,
      sort_by: 'starts_at',
      sort_direction: 'asc',
      per_page: 50,
    }).catch(() => {});
  }, [currentMonth, fetchLessons, selectedTeachingPlanId]);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadPublicHolidays() {
      setHolidaysLoading(true);
      setHolidayError(null);

      try {
        const holidays = await fetchPublicHolidays(currentMonth.getFullYear());

        if (!shouldIgnore) {
          setPublicHolidays(holidays);
        }
      } catch (requestError) {
        if (!shouldIgnore) {
          setHolidayError(requestError.message);
          setPublicHolidays([]);
        }
      } finally {
        if (!shouldIgnore) {
          setHolidaysLoading(false);
        }
      }
    }

    loadPublicHolidays();

    return () => {
      shouldIgnore = true;
    };
  }, [currentMonth]);

  return (
    <section className="grid gap-6">
      {isLoading && <LoadingOverlay label="Loading calendar..." />}

      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-slate-500">E Classroom</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Dashboard</h1>
        <p className="mt-3 text-slate-600">
          {user?.name}, these are the lessons assigned to you for the selected month.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {holidayError && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-800">
          {holidayError}
        </div>
      )}

      <CalendarControls
        currentMonth={currentMonth}
        teachingPlans={teachingPlans}
        selectedTeachingPlanId={selectedTeachingPlanId}
        onTeachingPlanChange={setSelectedTeachingPlanId}
        onPreviousMonth={() => setCurrentMonth((month) => addMonths(month, -1))}
        onNextMonth={() => setCurrentMonth((month) => addMonths(month, 1))}
      />

      <MonthCalendar
        currentMonth={currentMonth}
        currentUserId={user?.id}
        holidays={publicHolidays}
        lessons={lessons}
        onAttendanceChange={handleAttendanceChange}
      />
    </section>
  );
}

export default DashboardPage;
