// WorkTime model

import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';
import { IOrder } from './order.model';

export interface IWorkTime extends Document {
  user: Types.ObjectId | IUser;
  order?: Types.ObjectId | IOrder; // Необязательно, если работа не связана с конкретным заказом
  date: Date;
  hours: number;
  hourlyRate: number;
  description: string;
  approved: boolean;
  approvedBy?: Types.ObjectId | IUser;
  approvedAt?: Date;
}

const WorkTimeSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },
  description: { type: String, required: true },
  approved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model<IWorkTime>('WorkTime', WorkTimeSchema);
