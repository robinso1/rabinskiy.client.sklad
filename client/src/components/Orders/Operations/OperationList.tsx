// OperationList component
import React from 'react';

interface Operation {
  id: string;
  name: string;
  quantity: number;
  completedQuantity: number;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
}

interface OperationListProps {
  operations: Operation[];
  onOperationSelect?: (operationId: string) => void;
}

const OperationList: React.FC<OperationListProps> = ({ operations, onOperationSelect }) => {
  return (
    <div className="operation-list">
      <h3>Список операций</h3>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>Выполнено</th>
            <th>Статус</th>
            <th>Исполнитель</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {operations.map(operation => (
            <tr key={operation.id}>
              <td>{operation.name}</td>
              <td>{operation.quantity}</td>
              <td>{operation.completedQuantity}</td>
              <td>{operation.status}</td>
              <td>{operation.assignedTo || 'Не назначен'}</td>
              <td>
                <button onClick={() => onOperationSelect?.(operation.id)}>
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

export default OperationList;
