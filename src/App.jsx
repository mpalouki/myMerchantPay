import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PlaceholderPage from './components/PlaceholderPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import ApiIntegration from './pages/ApiIntegration.jsx';
import Recharge from './pages/Recharge.jsx';
import RechargeHistory from './pages/RechargeHistory.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
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
        <Route path="roles" element={<PlaceholderPage title="Gestion des rôles" icon="roles" />} />
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
