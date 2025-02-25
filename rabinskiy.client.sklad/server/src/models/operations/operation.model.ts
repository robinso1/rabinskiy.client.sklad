// Operation model

import mongoose, { Schema, Document } from 'mongoose';

export interface IOperation extends Document {
  name: string;
  description?: string;
  defaultRate: number; // Стандартная расценка за единицу
}

const OperationSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  defaultRate: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IOperation>('Operation', OperationSchema);
