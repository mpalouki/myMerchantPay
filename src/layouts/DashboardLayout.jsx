import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import { AccountProvider } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/I18nContext.jsx';

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

  const kycStatus = merchant?.kycStatus;
  if (KYC_REQUIRED_STATUSES.includes(kycStatus) && !PAGES_ALLOWED_BEFORE_KYC.includes(pathname)) {
    return <Navigate to={KYC_PAGE} replace />;
  }

  // AccountProvider sits here so the selected country is shared by the sidebar and every
  // logged-in page, and persists while navigating between them.
  return (
    <AccountProvider>
      <div className="app-shell">
        <Topbar />
        <div className="app-body">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
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
