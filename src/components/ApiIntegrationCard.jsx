import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import Tabs from './Tabs.jsx';
import { API_INTEGRATION_TABS } from '../data/apiApplications.js';

// Frame of the "Intégrez notre API" sub-pages (new / edit application): card header, intro,
// and the tabs with "Applications" active — the other tabs lead back to the list.
export default function ApiIntegrationCard({ title, children }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card__header">
        <Icon name="settings" size={16} className="card__header-icon" /> {title}
      </div>
      <div className="card__body">
        <p className="api-intro">Intégrer notre API au sein de vos applications en générant vos clés API ici.</p>
        <Tabs
          tabs={API_INTEGRATION_TABS}
          active="apps"
          onChange={(tab) => navigate('/dashboard/api-integration', { state: { tab } })}
        />
        <div className="tab-panel">{children}</div>
      </div>
    </div>
  );
}
