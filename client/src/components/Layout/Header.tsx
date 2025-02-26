// Header component
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useApp();

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h1>Система управления складом</h1>
      </div>
      <div className="header-right">
        {user ? (
          <div className="user-info">
            <span>{user.fullName}</span>
            <button onClick={logout}>Выйти</button>
          </div>
        ) : (
          <span>Не авторизован</span>
        )}
      </div>
    </header>
  );
};

export default Header;
