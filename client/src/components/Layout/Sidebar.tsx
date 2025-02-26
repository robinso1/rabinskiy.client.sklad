// Sidebar component
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { sidebarCollapsed } = useApp();

  if (!user) return null;

  return (
    <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <nav>
        <ul>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/orders">Заказы</Link>
          </li>
          {user.role === 'admin' && (
            <li>
              <Link to="/admin">Администрирование</Link>
            </li>
          )}
          <li>
            <Link to="/profile">Профиль</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
