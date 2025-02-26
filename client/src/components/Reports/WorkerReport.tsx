// WorkerReport component
import React from 'react';

interface WorkTimeRecord {
  id: string;
  date: string;
  hours: number;
  rate: number;
  description: string;
  approved: boolean;
}

interface WorkerReportItem {
  id: string;
  fullName: string;
  workTime: WorkTimeRecord[];
  totalHours: number;
  totalAmount: number;
}

interface WorkerReportProps {
  workers: WorkerReportItem[];
  startDate: string;
  endDate: string;
}

const WorkerReport: React.FC<WorkerReportProps> = ({ workers, startDate, endDate }) => {
  const totalAmount = workers.reduce((sum, worker) => sum + worker.totalAmount, 0);
  const totalHours = workers.reduce((sum, worker) => sum + worker.totalHours, 0);

  return (
    <div className="worker-report">
      <h2>Отчет по работникам</h2>
      <div className="report-period">
        <p>Период: с {startDate} по {endDate}</p>
      </div>
      <div className="report-summary">
        <p>Всего часов: {totalHours}</p>
        <p>Общая сумма: {totalAmount.toFixed(2)} ₽</p>
      </div>
      {workers.map(worker => (
        <div key={worker.id} className="worker-section">
          <h3>{worker.fullName}</h3>
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Часы</th>
                <th>Ставка</th>
                <th>Сумма</th>
                <th>Описание</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {worker.workTime.map(record => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.hours}</td>
                  <td>{record.rate.toFixed(2)} ₽/час</td>
                  <td>{(record.hours * record.rate).toFixed(2)} ₽</td>
                  <td>{record.description}</td>
                  <td>{record.approved ? 'Утверждено' : 'Ожидает'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Итого:</td>
                <td>{worker.totalHours} ч</td>
                <td colSpan={2}>{worker.totalAmount.toFixed(2)} ₽</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}
    </div>
  );
};

export default WorkerReport;
