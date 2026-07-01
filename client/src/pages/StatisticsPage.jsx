import { useEffect, useMemo, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import SummaryCard from '../components/statistics/SummaryCard.jsx';
import { buildStatistics, fetchStatisticsData } from '../lib/statistics.js';

const emptyStatistics = {
  lessons: [],
  teachingPlans: [],
  users: [],
};

function StatisticsPage() {
  const [data, setData] = useState(emptyStatistics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const statistics = useMemo(() => buildStatistics(data), [data]);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadStatistics() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchStatisticsData();

        if (!shouldIgnore) {
          setData(response);
        }
      } catch (requestError) {
        if (!shouldIgnore) {
          setError(requestError.message);
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    }

    loadStatistics();

    return () => {
      shouldIgnore = true;
    };
  }, []);

  return (
    <section className="grid gap-6">
      {isLoading && <LoadingOverlay label="Loading statistics..." />}

      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Admin</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Statistics</h1>
        <p className="mt-3 text-slate-600">
          Overview of lessons, teaching plans, professor assignments and attendance status.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          helper="Created lessons"
          label="Lessons"
          tone="blue"
          value={statistics.summary.lessons}
        />
        <SummaryCard
          helper="Active plans"
          label="Teaching plans"
          tone="green"
          value={statistics.summary.teachingPlans}
        />
        <SummaryCard
          helper="Users with professor role"
          label="Professors"
          tone="yellow"
          value={statistics.summary.professors}
        />
        <SummaryCard
          helper="Present assignments"
          label="Attendance rate"
          tone="red"
          value={`${statistics.summary.attendanceRate}%`}
        />
      </div>
    </section>
  );
}

export default StatisticsPage;
