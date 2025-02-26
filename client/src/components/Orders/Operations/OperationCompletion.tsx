// OperationCompletion component
import React, { useState } from 'react';

interface OperationCompletionProps {
  operationId: string;
  orderId: string;
  onComplete?: (quantity: number, comments: string) => void;
}

const OperationCompletion: React.FC<OperationCompletionProps> = ({ 
  operationId, 
  orderId, 
  onComplete 
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [comments, setComments] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onComplete) {
      onComplete(quantity, comments);
    }
  };

  return (
    <div className="operation-completion">
      <h3>Отметка о выполнении операции</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quantity">Количество выполненных единиц</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Комментарии</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
          />
        </div>
        <button type="submit">Отметить как выполненное</button>
      </form>
    </div>
  );
};

export default OperationCompletion;
