// Order model

import mongoose, { Schema, Document, Types } from 'mongoose';
import { IOperation } from './operations/operation.model';
import { IUser } from './user.model';

// Интерфейс для операции в заказе
export interface IOrderOperation {
  operation: Types.ObjectId | IOperation;
  quantity: number;
  completedQuantity: number;
  rate: number; // Индивидуальная расценка для этой операции в этом заказе
  assignedTo?: Types.ObjectId | IUser;
  completionDate?: Date;
  comments?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// Интерфейс для материала в заказе
export interface IOrderMaterial {
  material: Types.ObjectId;
  quantity: number;
  unit: string;
}

// Интерфейс для дочернего заказа (разветвление)
export interface IChildOrder {
  orderId: Types.ObjectId;
  reason: string;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  articleNumber: string;
  quantity: number;
  operations: IOrderOperation[];
  materials: IOrderMaterial[];
  status: 'created' | 'in_progress' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  comments?: string;
  parentOrder?: Types.ObjectId | IOrder; // Ссылка на родительский заказ, если это разветвление
  childOrders?: IChildOrder[]; // Ссылки на дочерние заказы (разветвления)
}

const OrderOperationSchema = new Schema({
  operation: { type: Schema.Types.ObjectId, ref: 'Operation', required: true },
  quantity: { type: Number, required: true },
  completedQuantity: { type: Number, default: 0 },
  rate: { type: Number, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  completionDate: { type: Date },
  comments: { type: String },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' }
});

const OrderMaterialSchema = new Schema({
  material: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
});

const ChildOrderSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  reason: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  articleNumber: { type: String, required: true },
  quantity: { type: Number, required: true },
  operations: [OrderOperationSchema],
  materials: [OrderMaterialSchema],
  status: { 
    type: String, 
    enum: ['created', 'in_progress', 'completed', 'cancelled'], 
    default: 'created' 
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  comments: { type: String },
  parentOrder: { type: Schema.Types.ObjectId, ref: 'Order' },
  childOrders: [ChildOrderSchema]
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
