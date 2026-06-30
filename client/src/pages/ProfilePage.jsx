import { useEffect, useMemo, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import { apiRequest, queryString } from '../lib/api.js';
import { lessonStatsForUser } from '../lib/lessonStats.js';
import { useAuthStore } from '../stores/useAuthStore.js';

async function fetchAllUserLessons() {
  const params = {
    per_page: 50,
    sort_by: 'starts_at',
    sort_direction: 'asc',
  };
  let currentPage = 1;
  const lessons = [];

  while (true) {
    const response = await apiRequest(
      `/lessons${queryString({
        ...params,
        page: currentPage,
      })}`,
    );

    lessons.push(...(response.lessons ?? []));
    const lastPage = response.last_page ?? 1;

    if (currentPage >= lastPage) {
      break;
    }

    currentPage += 1;
  }

  return lessons;
}

function InfoItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-slate-950">{value || '-'}</dd>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const toneClasses = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    green: 'border-green-100 bg-green-50 text-green-700',
    red: 'border-red-100 bg-red-50 text-red-700',
    yellow: 'border-yellow-100 bg-yellow-50 text-yellow-700',
  };

  return (
    <article className={['rounded-lg border p-5', toneClasses[tone]].join(' ')}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
    </article>
  );
}

function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const stats = useMemo(() => lessonStatsForUser(lessons, user?.id), [lessons, user?.id]);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadLessons() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchAllUserLessons();

        if (!shouldIgnore) {
          setLessons(response);
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

    loadLessons();

    return () => {
      shouldIgnore = true;
    };
  }, []);

  return (
    <section className="space-y-8">
      {isLoading && <LoadingOverlay label="Loading profile..." />}

      <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Account</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Profile</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-950">Basic information</h2>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Name" value={user?.name} />
          <InfoItem label="Email" value={user?.email} />
          <InfoItem label="Role" value={user?.role} />
          <InfoItem label="User ID" value={user?.id} />
        </dl>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-950">Lesson attendance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total lessons" value={stats.total} tone="blue" />
          <StatCard label="Present" value={stats.present} tone="green" />
          <StatCard label="Absent" value={stats.absent} tone="red" />
          <StatCard label="Pending input" value={stats.pending} tone="yellow" />
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
