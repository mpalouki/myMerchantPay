import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { SIDEBAR_ITEMS, RELOAD_SUBMENU, TRANSFER_ITEM, WITHDRAW_ITEM } from '../data/mockData.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useAccount } from '../context/AccountContext.jsx';
import Flag from './Flag.jsx';
import usePermissions from '../hooks/usePermissions.js';

const linkClass = ({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`;

// Full-height navigation: brand, the merchant and its selected account, then the pages. Collapses
// to icons on desktop; under 900px it is a drawer (DashboardLayout's app-shell--nav-open).
export default function Sidebar({ collapsed, onToggle, onClose }) {
  const { merchant } = useAuth();
  const { selectedBalance, loading: accountLoading } = useAccount();
  const location = useLocation();
  const [reloadOpen, setReloadOpen] = useState(location.pathname.startsWith('/dashboard/reload'));
  // Only the pages the login's roles open, on the selected account.
  const { can } = usePermissions();
  const allowed = (item) => !item.permission || can(item.permission);
  const reloadItems = RELOAD_SUBMENU.filter(allowed);
  const moneyItems = [WITHDRAW_ITEM, TRANSFER_ITEM].filter(allowed);

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`} aria-label="Navigation">
      <div className="sidebar__brand">
        {collapsed ? <span className="sidebar__monogram">m</span> : <Logo variant="white" size={22} />}
        <button type="button" className="sidebar__close" onClick={onClose} aria-label="Fermer le menu">
          <Icon name="close" size={18} />
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar__account">
          <div className="sidebar__merchant">{merchant?.name ?? 'Compte business'}</div>
          {selectedBalance ? (
            <div className="sidebar__account-line">
              <Flag code={selectedBalance.country.codeAlpha2} className="sidebar__flag" />
              <span className="sidebar__account-number" title={`Compte ${selectedBalance.country.name}`}>
                {selectedBalance.accountNumberFormatted}
              </span>
            </div>
          ) : (
            <div className="sidebar__account-line">{accountLoading ? 'Chargement…' : 'Aucun compte'}</div>
          )}
        </div>
      )}

      <nav className="sidebar__nav">
        {SIDEBAR_ITEMS.filter(allowed).map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === '/dashboard'}
            className={linkClass}
            title={collapsed ? item.label : undefined}
          >
            <Icon name={item.icon} />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.badge && <span className="badge badge--new">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      {(reloadItems.length > 0 || moneyItems.length > 0) && (
        <div className="sidebar__group-label">{!collapsed && 'Mouvements de fonds'}</div>
      )}

      <nav className="sidebar__nav">
        {reloadItems.length > 0 && (
          <button
            type="button"
            className="sidebar__link"
            onClick={() => setReloadOpen((v) => !v)}
            aria-expanded={reloadOpen}
            title={collapsed ? 'Recharger le compte' : undefined}
          >
            <Icon name="plus" />
            {!collapsed && <span>Recharger le compte</span>}
            {!collapsed && (
              <Icon name={reloadOpen ? 'chevronDown' : 'chevronRight'} size={14} className="sidebar__caret" />
            )}
          </button>
        )}
        {reloadOpen && !collapsed && reloadItems.length > 0 && (
          <div className="sidebar__submenu">
            {reloadItems.map((sub) => (
              <NavLink
                key={sub.key}
                to={sub.path}
                end
                className={({ isActive }) => `sidebar__sublink${isActive ? ' sidebar__sublink--active' : ''}`}
              >
                {sub.label}
              </NavLink>
            ))}
          </div>
        )}

        {moneyItems.map((item) => (
          <NavLink key={item.key} to={item.path} className={linkClass} title={collapsed ? item.label : undefined}>
            <Icon name={item.icon} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="sidebar__collapse-btn"
        onClick={onToggle}
        aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
      >
        <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={16} />
        {!collapsed && <span>Replier</span>}
      </button>
    </aside>
  );
}
