// OrderBranching component
import React, { useState } from 'react';

interface OrderBranchingProps {
  orderId: string;
  onBranch?: (quantity: number, reason: string) => void;
}

const OrderBranching: React.FC<OrderBranchingProps> = ({ orderId, onBranch }) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBranch) {
      onBranch(quantity, reason);
    }
  };

  return (
    <div className="order-branching">
      <h3>Разветвление заказа</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quantity">Количество изделий для нового заказа</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Причина разветвления</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
          />
        </div>
        <button type="submit">Создать новый заказ</button>
      </form>
    </div>
  );
};

export default OrderBranching;
