import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>E-Classroom</h1>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
