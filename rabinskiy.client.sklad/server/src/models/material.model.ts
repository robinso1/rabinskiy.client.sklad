// Material model

import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  name: string;
  code: string; // Код материала
  unit: string; // Единица измерения (м², шт, кг и т.д.)
  description?: string;
  price?: number; // Цена за единицу
  inStock?: number; // Количество на складе
  quantity?: number; // Количество для синхронизации с МойСклад
  moyskladId?: string; // ID в системе "Мой склад" для интеграции
  externalId?: string; // Внешний ID для интеграции с другими системами
}

const MaterialSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  unit: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  inStock: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  moyskladId: { type: String },
  externalId: { type: String }
}, { timestamps: true });

export default mongoose.model<IMaterial>('Material', MaterialSchema);
