// OrdersPage component
import React from 'react';

const OrdersPage: React.FC = () => {
  // Здесь будет логика для получения заказов
  const orders = [
    { id: 1, number: 'ORD-001', customer: 'ООО Компания', status: 'В работе', date: '2023-05-15' },
    { id: 2, number: 'ORD-002', customer: 'ИП Иванов', status: 'Завершен', date: '2023-05-10' },
    { id: 3, number: 'ORD-003', customer: 'ЗАО Предприятие', status: 'Новый', date: '2023-05-18' },
  ];

  return (
    <div className="orders-page">
      <h1>Управление заказами</h1>
      <div className="orders-controls">
        <button>Новый заказ</button>
        <input type="text" placeholder="Поиск заказов" />
      </div>
      <div className="orders-list">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Номер заказа</th>
              <th>Заказчик</th>
              <th>Статус</th>
              <th>Дата</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.number}</td>
                <td>{order.customer}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
                <td>
                  <button>Просмотр</button>
                  <button>Редактировать</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
