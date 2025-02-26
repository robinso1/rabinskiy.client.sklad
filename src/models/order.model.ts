// Order model

import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string; // Номер заказа
  articleNumber: string; // Артикул
  customer: string; // Заказчик
  description?: string; // Описание заказа
  status: 'created' | 'in_progress' | 'completed' | 'canceled'; // Статус заказа
  startDate: Date; // Дата начала
  endDate?: Date; // Дата завершения
  techProcessId: mongoose.Types.ObjectId; // ID техпроцесса
  parentOrderId?: mongoose.Types.ObjectId; // ID родительского заказа (для разветвления)
  childOrders?: mongoose.Types.ObjectId[]; // ID дочерних заказов (для разветвления)
  quantity: number; // Количество изделий
  completedQuantity: number; // Выполненное количество
  totalMaterialsCost: number; // Общая стоимость материалов
  totalWorkCost: number; // Общая стоимость работ
  totalCost: number; // Общая стоимость заказа
  comments?: string; // Комментарии к заказу
  moyskladId?: string; // ID в системе "Мой склад" для интеграции
}

const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  articleNumber: { type: String, required: true },
  customer: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['created', 'in_progress', 'completed', 'canceled'], 
    default: 'created' 
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  techProcessId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TechProcess', 
    required: true 
  },
  parentOrderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order' 
  },
  childOrders: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order' 
  }],
  quantity: { type: Number, required: true, default: 1 },
  completedQuantity: { type: Number, default: 0 },
  totalMaterialsCost: { type: Number, default: 0 },
  totalWorkCost: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  comments: { type: String },
  moyskladId: { type: String }
}, { timestamps: true });

// Индексы для быстрого поиска
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ articleNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ startDate: 1 });
OrderSchema.index({ endDate: 1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
