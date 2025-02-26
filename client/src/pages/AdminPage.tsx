// AdminPage component
import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="admin-page">
      <h1>Панель администратора</h1>
      <div className="admin-content">
        <div className="admin-section">
          <h2>Управление пользователями</h2>
          <p>Здесь будет список пользователей и функции управления</p>
        </div>
        <div className="admin-section">
          <h2>Настройки системы</h2>
          <p>Здесь будут настройки системы</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
