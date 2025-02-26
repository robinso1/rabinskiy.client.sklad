// App component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Импорт компонентов страниц
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<div>Страница не найдена</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
