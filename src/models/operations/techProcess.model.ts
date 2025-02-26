// TechProcess model

import mongoose, { Schema, Document } from 'mongoose';

export interface ITechProcess extends Document {
  name: string; // Название техпроцесса
  code: string; // Код техпроцесса
  description?: string; // Описание техпроцесса
  operations: Array<{ // Операции в техпроцессе
    operationId: mongoose.Types.ObjectId;
    order: number; // Порядок выполнения
    quantity: number; // Количество операций на единицу изделия
    optional: boolean; // Опциональная операция или обязательная
  }>;
  materials: Array<{ // Материалы, используемые в техпроцессе
    materialId: mongoose.Types.ObjectId;
    quantity: number; // Количество материала на единицу изделия
    optional: boolean; // Опциональный материал или обязательный
  }>;
  active: boolean; // Активен ли техпроцесс
}

const TechProcessSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  operations: [{
    operationId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Operation', 
      required: true 
    },
    order: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    optional: { type: Boolean, default: false }
  }],
  materials: [{
    materialId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Material', 
      required: true 
    },
    quantity: { type: Number, required: true, default: 1 },
    optional: { type: Boolean, default: false }
  }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Индексы для быстрого поиска
TechProcessSchema.index({ name: 1 });
TechProcessSchema.index({ code: 1 });
TechProcessSchema.index({ active: 1 });

export default mongoose.model<ITechProcess>('TechProcess', TechProcessSchema); 