import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { AccountProvider } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/I18nContext.jsx';
import { useDeskBody } from '../hooks/useDeskBody.js';

// Until the merchant has submitted a KYC (or after a rejection), the portal only opens the
// KYC validation page, plus settings so the password can still be changed.
const KYC_REQUIRED_STATUSES = ['not_submitted', 'rejected'];
const KYC_PAGE = '/dashboard/kyc';
const PAGES_ALLOWED_BEFORE_KYC = [KYC_PAGE, '/dashboard/settings'];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { merchant } = useAuth();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  // Under 900px the sidebar is a drawer, opened from the topbar. It stays open only on the page
  // it was opened on, so picking a page closes it.
  const [navOpenOn, setNavOpenOn] = useState(null);
  const navOpen = navOpenOn === pathname;
  const closeNav = () => setNavOpenOn(null);

  useDeskBody();

  const kycStatus = merchant?.kycStatus;
  if (KYC_REQUIRED_STATUSES.includes(kycStatus) && !PAGES_ALLOWED_BEFORE_KYC.includes(pathname)) {
    return <Navigate to={KYC_PAGE} replace />;
  }

  // AccountProvider sits here so the selected country is shared by the sidebar and every
  // logged-in page, and persists while navigating between them.
  return (
    <AccountProvider>
      <div className={`app-shell${navOpen ? ' app-shell--nav-open' : ''}`}>
        <Sidebar
          collapsed={collapsed && !navOpen}
          onToggle={() => setCollapsed((v) => !v)}
          onClose={closeNav}
        />
        {navOpen && <div className="app-shell__scrim" onClick={closeNav} aria-hidden="true" />}
        <div className="app-main">
          <Topbar onOpenNav={() => setNavOpenOn(pathname)} />
          <main className="app-content">
            {kycStatus === 'pending' && pathname !== KYC_PAGE && (
              <div className="kyc-banner">
                {t('kyc.banner')} <Link to={KYC_PAGE}>{t('kyc.bannerLink')}</Link>
              </div>
            )}
            <Outlet />
          </main>
        </div>
      </div>
    </AccountProvider>
  );
}
