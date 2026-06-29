import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { homePathFor } from '../lib/authRoutes.js';
import { useAuthStore } from '../stores/useAuthStore.js';

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const validationErrors = useAuthStore((state) => state.validationErrors);
  const clearError = useAuthStore((state) => state.clearError);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  function updateField(event) {
    clearError();
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const user = await login(form);
      navigate(homePathFor(user));
    } catch {
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">E Classroom</p>
        <h1 className="text-3xl font-bold tracking-tight">Login</h1>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Email</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
            />
            {validationErrors.email && (
              <span className="text-sm font-medium text-red-600">{validationErrors.email[0]}</span>
            )}
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Password</span>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              autoComplete="current-password"
              required
            />
            {validationErrors.password && (
              <span className="text-sm font-medium text-red-600">
                {validationErrors.password[0]}
              </span>
            )}
          </label>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            className="mt-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          No account yet?{' '}
          <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/register">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
