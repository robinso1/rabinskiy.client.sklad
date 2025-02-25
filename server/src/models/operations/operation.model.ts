// Operation model

import mongoose, { Schema, Document } from 'mongoose';

export interface IOperation extends Document {
  name: string; // Название операции
  description?: string; // Описание операции
  defaultRate: number; // Стандартная расценка за единицу
  active: boolean; // Активна ли операция
  userRates?: Array<{ // Индивидуальные расценки для пользователей
    userId: mongoose.Types.ObjectId;
    rate: number;
  }>;
}

const OperationSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  defaultRate: { type: Number, required: true, default: 0 },
  active: { type: Boolean, default: true },
  userRates: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    rate: { type: Number, required: true }
  }]
}, { timestamps: true });

// Индексы для быстрого поиска
OperationSchema.index({ name: 1 });
OperationSchema.index({ active: 1 });

export default mongoose.model<IOperation>('Operation', OperationSchema);
