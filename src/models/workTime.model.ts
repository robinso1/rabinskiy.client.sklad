// WorkTime model

import { Schema, model, Types } from 'mongoose';

export interface IWorkTime {
  user: Types.ObjectId;
  order?: Types.ObjectId;
  date: Date;
  hours: number;
  hourlyRate: number;
  description: string;
  approved: boolean;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
}

const workTimeSchema = new Schema<IWorkTime>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  date: {
    type: Date,
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

// Индексы для быстрого поиска
workTimeSchema.index({ user: 1 });
workTimeSchema.index({ order: 1 });
workTimeSchema.index({ date: 1 });
workTimeSchema.index({ approved: 1 });

export default model<IWorkTime>('WorkTime', workTimeSchema);
