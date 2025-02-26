// OrderList component
import React from 'react';

interface Order {
  id: string;
  orderNumber: string;
  articleNumber: string;
  customer: string;
  status: 'created' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
}

interface OrderListProps {
  orders: Order[];
  onOrderSelect?: (orderId: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onOrderSelect }) => {
  return (
    <div className="order-list">
      <h3>Список заказов</h3>
      <table>
        <thead>
          <tr>
            <th>Номер заказа</th>
            <th>Артикул</th>
            <th>Заказчик</th>
            <th>Статус</th>
            <th>Дата начала</th>
            <th>Дата завершения</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.articleNumber}</td>
              <td>{order.customer}</td>
              <td>{order.status}</td>
              <td>{order.startDate}</td>
              <td>{order.endDate || '-'}</td>
              <td>
                <button onClick={() => onOrderSelect?.(order.id)}>
                  Подробнее
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
