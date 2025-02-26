// OrderDetails component
import React from 'react';

interface OrderDetailsProps {
  orderId?: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  return (
    <div className="order-details">
      <h2>Детали заказа {orderId}</h2>
      <div className="order-info">
        <div className="info-section">
          <h3>Основная информация</h3>
          <p>Номер заказа: {orderId || 'Не указан'}</p>
          <p>Статус: В обработке</p>
          <p>Дата создания: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="info-section">
          <h3>Операции</h3>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Количество</th>
                <th>Статус</th>
                <th>Исполнитель</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Операция 1</td>
                <td>10</td>
                <td>В работе</td>
                <td>Иванов И.И.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="info-section">
          <h3>Материалы</h3>
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Количество</th>
                <th>Единица измерения</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Материал 1</td>
                <td>5</td>
                <td>шт</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
