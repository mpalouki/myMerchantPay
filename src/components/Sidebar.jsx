import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import { SIDEBAR_ITEMS, RECHARGE_SUBMENU, WITHDRAW_ITEM } from '../data/mockData.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Sidebar({ collapsed, onToggle }) {
  const { merchant } = useAuth()
  const location = useLocation()
  const [rechargeOpen, setRechargeOpen] = useState(
    location.pathname.startsWith('/dashboard/recharge'),
  )

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__brand">
        <Logo variant="white" size={collapsed ? 0 : 22} />
      </div>

      {!collapsed && (
        <div className="sidebar__account">
          <div className="sidebar__account-type">({merchant?.name ?? 'COMPTE BUSINESS'})</div>
          <div className="sidebar__account-label">Numéro de compte</div>
          <div className="sidebar__account-number">{merchant?.id ? `(#${merchant.id})` : ''}</div>
        </div>
      )}

      <nav className="sidebar__nav">
        {SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <Icon name={item.icon} />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.badge && <span className="badge badge--new">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__divider" />

      <nav className="sidebar__nav">
        <button
          type="button"
          className="sidebar__link sidebar__link--button"
          onClick={() => setRechargeOpen((v) => !v)}
        >
          <Icon name="plus" />
          {!collapsed && <span>Recharger le compte</span>}
          {!collapsed && (
            <Icon
              name={rechargeOpen ? 'chevronDown' : 'chevronRight'}
              size={14}
              className="sidebar__caret"
            />
          )}
        </button>
        {rechargeOpen && !collapsed && (
          <div className="sidebar__submenu">
            {RECHARGE_SUBMENU.map((sub) => (
              <NavLink
                key={sub.key}
                to={sub.path}
                end
                className={({ isActive }) =>
                  `sidebar__sublink ${isActive ? 'sidebar__sublink--active' : ''}`
                }
              >
                <span className="sidebar__dot" />
                {sub.label}
              </NavLink>
            ))}
          </div>
        )}

        <NavLink
          to={WITHDRAW_ITEM.path}
          className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          title={collapsed ? WITHDRAW_ITEM.label : undefined}
        >
          <Icon name={WITHDRAW_ITEM.icon} />
          {!collapsed && <span>{WITHDRAW_ITEM.label}</span>}
        </NavLink>
      </nav>

      <button type="button" className="sidebar__collapse-btn" onClick={onToggle}>
        <Icon name={collapsed ? 'chevronRight' : 'chevronDown'} size={14} />
      </button>
    </aside>
  )
}
