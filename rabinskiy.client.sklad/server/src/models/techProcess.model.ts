import mongoose, { Schema, Document, Types } from 'mongoose';
import { IOperation } from './operations/operation.model';
import { IMaterial } from './material.model';

// Интерфейс для операции в техпроцессе
export interface ITechProcessOperation {
  operation: Types.ObjectId | IOperation;
  order: number; // Порядок выполнения операции
  description?: string;
}

// Интерфейс для материала в техпроцессе
export interface ITechProcessMaterial {
  material: Types.ObjectId | IMaterial;
  quantity: number; // Количество на единицу изделия
  unit: string;
  isOptional: boolean; // Является ли материал опциональным
}

export interface ITechProcess extends Document {
  name: string;
  articleNumber: string; // Артикул изделия
  description?: string;
  operations: ITechProcessOperation[];
  materials: ITechProcessMaterial[];
  isActive: boolean;
}

const TechProcessOperationSchema = new Schema({
  operation: { type: Schema.Types.ObjectId, ref: 'Operation', required: true },
  order: { type: Number, required: true },
  description: { type: String }
});

const TechProcessMaterialSchema = new Schema({
  material: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  isOptional: { type: Boolean, default: false }
});

const TechProcessSchema: Schema = new Schema({
  name: { type: String, required: true },
  articleNumber: { type: String, required: true, unique: true },
  description: { type: String },
  operations: [TechProcessOperationSchema],
  materials: [TechProcessMaterialSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ITechProcess>('TechProcess', TechProcessSchema); 