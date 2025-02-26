// OrderReport component
import React from 'react';

interface OrderReportItem {
  id: string;
  orderNumber: string;
  customer: string;
  startDate: string;
  endDate?: string;
  status: string;
  totalMaterialCost: number;
  totalWorkCost: number;
  totalCost: number;
}

interface OrderReportProps {
  orders: OrderReportItem[];
}

const OrderReport: React.FC<OrderReportProps> = ({ orders }) => {
  const totalCost = orders.reduce((sum, order) => sum + order.totalCost, 0);

  return (
    <div className="order-report">
      <h2>Отчет по заказам</h2>
      <div className="report-summary">
        <p>Всего заказов: {orders.length}</p>
        <p>Общая стоимость: {totalCost.toFixed(2)} ₽</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Номер заказа</th>
            <th>Заказчик</th>
            <th>Дата начала</th>
            <th>Дата завершения</th>
            <th>Статус</th>
            <th>Материалы</th>
            <th>Работы</th>
            <th>Итого</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.customer}</td>
              <td>{order.startDate}</td>
              <td>{order.endDate || '-'}</td>
              <td>{order.status}</td>
              <td>{order.totalMaterialCost.toFixed(2)} ₽</td>
              <td>{order.totalWorkCost.toFixed(2)} ₽</td>
              <td>{order.totalCost.toFixed(2)} ₽</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>Итого:</td>
            <td>{orders.reduce((sum, order) => sum + order.totalMaterialCost, 0).toFixed(2)} ₽</td>
            <td>{orders.reduce((sum, order) => sum + order.totalWorkCost, 0).toFixed(2)} ₽</td>
            <td>{totalCost.toFixed(2)} ₽</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderReport;
