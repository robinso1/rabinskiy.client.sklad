// Login component
import React, { useState } from 'react';

interface LoginProps {
  onLogin?: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }
    
    if (onLogin) {
      onLogin(username, password);
    } else {
      console.log('Login attempt:', { username, password });
    }
  };

  return (
    <div className="login-form">
      <h2>Вход в систему</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Войти</button>
      </form>
    </div>
  );
};

export default Login;
