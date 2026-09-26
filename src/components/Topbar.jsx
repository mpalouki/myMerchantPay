import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Topbar() {
  const { user, merchant, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = merchant?.name || user?.email || '';
  const initials = merchant?.name
    ? merchant.name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '';

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <Logo />
      </div>
      <div className="topbar__right">
        <button type="button" className="topbar__bell" aria-label="Notifications">
          <Icon name="bell" size={20} />
        </button>
        <div className="topbar__user" ref={menuRef}>
          <button type="button" className="topbar__user-btn" onClick={() => setMenuOpen((v) => !v)}>
            <span className="avatar">{initials}</span>
            <span className="topbar__user-name">{displayName.toUpperCase()}</span>
            <Icon name="chevronDown" size={14} />
          </button>
          {menuOpen && (
            <div className="topbar__menu">
              <a className="topbar__menu-item" onClick={() => setMenuOpen(false)} href="#reporting">
                Reporting
              </a>
              <button
                type="button"
                className="topbar__menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/dashboard/profile');
                }}
              >
                Profil du gestionnaire
              </button>
              <button
                type="button"
                className="topbar__menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/dashboard/settings');
                }}
              >
                Paramètres
              </button>
              <div className="topbar__menu-divider" />
              <button type="button" className="topbar__menu-item topbar__menu-item--danger" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
