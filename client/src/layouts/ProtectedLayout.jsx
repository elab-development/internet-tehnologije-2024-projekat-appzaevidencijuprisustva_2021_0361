import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import { homePathFor } from '../lib/authRoutes.js';
import { useAuthStore } from '../stores/useAuthStore.js';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-semibold transition',
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ');

function ProtectedLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAdmin = user?.role === 'admin';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {isLoading && <LoadingOverlay label="Please wait..." />}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <NavLink className="text-xl font-bold tracking-tight text-slate-950" to={homePathFor(user)}>
            E Classroom
          </NavLink>

          <div className="flex flex-wrap items-center gap-2">
            {isAdmin ? (
              <>
                <NavLink className={navLinkClass} to="/admin/dashboard">
                  Admin Dashboard
                </NavLink>
                <NavLink className={navLinkClass} to="/statistics">
                  Statistics
                </NavLink>
              </>
            ) : (
              <>
                <NavLink className={navLinkClass} to="/dashboard">
                  Dashboard
                </NavLink>
                <NavLink className={navLinkClass} to="/profile">
                  Profile
                </NavLink>
              </>
            )}
            <button
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto min-h-0 w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-sm text-slate-500">
          E Classroom
        </div>
      </footer>
    </div>
  );
}

export default ProtectedLayout;
