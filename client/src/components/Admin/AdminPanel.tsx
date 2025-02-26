// AdminPanel component
import React from 'react';

const AdminPanel: React.FC = () => {
  return (
    <div className="admin-panel">
      <h2>Панель администратора</h2>
      <div className="admin-panel-content">
        <div className="admin-panel-section">
          <h3>Пользователи</h3>
          <button>Управление пользователями</button>
        </div>
        <div className="admin-panel-section">
          <h3>Материалы</h3>
          <button>Управление материалами</button>
        </div>
        <div className="admin-panel-section">
          <h3>Операции</h3>
          <button>Управление операциями</button>
        </div>
        <div className="admin-panel-section">
          <h3>Интеграция с МойСклад</h3>
          <button>Настройки интеграции</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
