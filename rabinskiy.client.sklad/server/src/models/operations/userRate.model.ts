import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from '../user.model';
import { IOperation } from './operation.model';

export interface IUserRate extends Document {
  user: Types.ObjectId | IUser;
  operation: Types.ObjectId | IOperation;
  rate: number; // Индивидуальная расценка для этого исполнителя
}

const UserRateSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  operation: { type: Schema.Types.ObjectId, ref: 'Operation', required: true },
  rate: { type: Number, required: true }
}, { timestamps: true });

// Создаем составной индекс для уникальности пары пользователь-операция
UserRateSchema.index({ user: 1, operation: 1 }, { unique: true });

export default mongoose.model<IUserRate>('UserRate', UserRateSchema); 