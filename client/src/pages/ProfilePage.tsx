// ProfilePage component
import React, { useState } from 'react';

const ProfilePage: React.FC = () => {
  // Здесь будет логика для получения данных пользователя
  const [user, setUser] = useState({
    username: 'user1',
    fullName: 'Иванов Иван Иванович',
    email: 'user@example.com',
    role: 'Работник',
    hourlyRate: 150
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
    // Здесь будет логика сохранения данных
  };

  return (
    <div className="profile-page">
      <h1>Профиль пользователя</h1>
      <div className="profile-content">
        {!isEditing ? (
          <div className="profile-info">
            <p><strong>Имя пользователя:</strong> {user.username}</p>
            <p><strong>ФИО:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Роль:</strong> {user.role}</p>
            <p><strong>Почасовая ставка:</strong> {user.hourlyRate} руб/час</p>
            <button onClick={() => setIsEditing(true)}>Редактировать</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">ФИО</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={() => setIsEditing(false)}>Отмена</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
