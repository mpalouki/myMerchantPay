import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PlaceholderPage from './components/PlaceholderPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import SiteLayout from './components/site/SiteLayout.jsx';
import Home from './pages/site/Home.jsx';
import Presentation from './pages/site/Presentation.jsx';
import Services from './pages/site/Services.jsx';
import Partners from './pages/site/Partners.jsx';
import Contact from './pages/site/Contact.jsx';
import Faq from './pages/site/Faq.jsx';
import Pricing from './pages/site/Pricing.jsx';
import Support from './pages/site/Support.jsx';
import ApiDocs from './pages/site/ApiDocs.jsx';
import { Legal, Privacy, Terms } from './pages/site/LegalPages.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import ApiIntegration from './pages/ApiIntegration.jsx';
import ApiApplicationDetails from './pages/ApiApplicationDetails.jsx';
import ApiApplicationEdit from './pages/ApiApplicationEdit.jsx';
import ApiApplicationNew from './pages/ApiApplicationNew.jsx';
import Recharge from './pages/Recharge.jsx';
import RechargeHistory from './pages/RechargeHistory.jsx';
import Roles from './pages/Roles.jsx';
import KycValidation from './pages/KycValidation.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import JoinTeam from './pages/JoinTeam.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public showcase site */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/services" element={<Services />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/docs" element={<ApiDocs />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/join-team" element={<JoinTeam />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="kyc" element={<KycValidation />} />
        <Route path="send-money" element={<PlaceholderPage title="Envoyer de l'argent" icon="send" />} />
        <Route
          path="request-payment"
          element={<PlaceholderPage title="Demander un paiement" icon="request" />}
        />
        <Route
          path="collect-payments"
          element={<PlaceholderPage title="Collecter des paiements" icon="collect" />}
        />
        <Route
          path="disburse-payments"
          element={<PlaceholderPage title="Débourser des paiements" icon="disburse" />}
        />
        <Route path="api-integration" element={<ApiIntegration />} />
        <Route path="api-integration/new" element={<ApiApplicationNew />} />
        <Route path="api-integration/:appId" element={<ApiApplicationDetails />} />
        <Route path="api-integration/:appId/edit" element={<ApiApplicationEdit />} />
        <Route path="roles" element={<Roles />} />
        <Route path="recharge" element={<Recharge />} />
        <Route path="recharge/history" element={<RechargeHistory />} />
        <Route path="withdraw" element={<PlaceholderPage title="Retirer de l'argent" icon="withdraw" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
