// WorkerProfile component
import React, { useState } from 'react';

interface WorkerProfileProps {
  userId: string;
  initialData?: {
    username: string;
    fullName: string;
    email?: string;
    phone?: string;
    hourlyRate?: number;
  };
  onSave?: (data: any) => void;
}

const WorkerProfile: React.FC<WorkerProfileProps> = ({ userId, initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    username: '',
    fullName: '',
    email: '',
    phone: '',
    hourlyRate: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="worker-profile">
      <h2>Профиль работника</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fullName">ФИО</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
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
        <div className="form-group">
          <label htmlFor="phone">Телефон</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="hourlyRate">Почасовая ставка (₽)</label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            min="0"
            step="10"
          />
        </div>
        <button type="submit">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default WorkerProfile;
