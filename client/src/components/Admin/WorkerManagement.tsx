// WorkerManagement component
import React, { useState, useEffect } from 'react';

interface Worker {
  id: string;
  username: string;
  fullName: string;
  role: string;
  hourlyRate?: number;
}

const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Здесь будет загрузка списка работников с сервера
    // Временно используем моковые данные
    setWorkers([
      { id: '1', username: 'worker1', fullName: 'Работник 1', role: 'worker', hourlyRate: 150 },
      { id: '2', username: 'worker2', fullName: 'Работник 2', role: 'worker', hourlyRate: 200 },
    ]);
  }, []);

  return (
    <div className="worker-management">
      <h2>Управление работниками</h2>
      
      <div className="worker-list">
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Имя пользователя</th>
                <th>ФИО</th>
                <th>Роль</th>
                <th>Почасовая ставка</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(worker => (
                <tr key={worker.id}>
                  <td>{worker.username}</td>
                  <td>{worker.fullName}</td>
                  <td>{worker.role}</td>
                  <td>{worker.hourlyRate} ₽/час</td>
                  <td>
                    <button>Редактировать</button>
                    <button>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkerManagement;
