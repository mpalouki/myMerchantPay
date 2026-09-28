import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { AccountProvider } from '../context/AccountContext.jsx';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  // AccountProvider sits here so the selected country is shared by the sidebar and every
  // logged-in page, and persists while navigating between them.
  return (
    <AccountProvider>
      <div className="app-shell">
        <Topbar />
        <div className="app-body">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
          <main className="app-content">
            <Outlet />
          </main>
        </div>
      </div>
    </AccountProvider>
  );
}
