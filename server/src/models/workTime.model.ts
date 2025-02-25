// WorkTime model

import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkTime extends Document {
  userId: mongoose.Types.ObjectId; // ID пользователя
  orderId: mongoose.Types.ObjectId; // ID заказа
  operationId?: mongoose.Types.ObjectId; // ID операции (если применимо)
  date: Date; // Дата выполнения работы
  hours: number; // Количество часов
  hourlyRate: number; // Почасовая ставка
  quantity?: number; // Количество выполненных единиц (для сдельной оплаты)
  rate?: number; // Ставка за единицу (для сдельной оплаты)
  totalAmount: number; // Общая сумма
  description?: string; // Описание выполненной работы
  approved: boolean; // Статус утверждения
  approvedBy?: mongoose.Types.ObjectId; // Кто утвердил
  approvedAt?: Date; // Когда утверждено
  comments?: string; // Комментарии
}

const WorkTimeSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  operationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Operation' 
  },
  date: { type: Date, required: true, default: Date.now },
  hours: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  quantity: { type: Number },
  rate: { type: Number },
  totalAmount: { type: Number, required: true, default: 0 },
  description: { type: String },
  approved: { type: Boolean, default: false },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvedAt: { type: Date },
  comments: { type: String }
}, { timestamps: true });

// Индексы для быстрого поиска
WorkTimeSchema.index({ userId: 1 });
WorkTimeSchema.index({ orderId: 1 });
WorkTimeSchema.index({ date: 1 });
WorkTimeSchema.index({ approved: 1 });

export default mongoose.model<IWorkTime>('WorkTime', WorkTimeSchema);
