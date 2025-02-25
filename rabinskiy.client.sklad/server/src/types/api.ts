import { IUser } from '../models/user.model';
import { IOperation } from '../models/operations/operation.model';
import { IMaterial } from '../models/material.model';
import { IOrder } from '../models/order.model';
import { ITechProcess } from '../models/techProcess.model';
import { IWorkTime } from '../models/workTime.model';
import { IUserRate } from '../models/operations/userRate.model';
import { Types } from 'mongoose';

// General types
export type UserRole = 'admin' | 'manager' | 'worker';
export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

// Filter types
export interface OrderFilter {
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  number?: string;
  client?: string;
}

export interface WorkTimeFilter {
  userId?: Types.ObjectId;
  orderId?: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  approved?: boolean;
}

// Report types
export interface SalaryReportItem {
  userId: string;
  userName: string;
  totalHours: number;
  totalAmount: number;
  workTimeRecords: Array<{
    _id: string;
    date: Date;
    hours: number;
    hourlyRate: number;
    amount: number;
    orderId: string;
    orderNumber: string;
    approved: boolean;
  }>;
}

export interface OrderReportItem {
  _id: string;
  number: string;
  client: string;
  startDate: Date;
  endDate?: Date;
  status: OrderStatus;
  totalMaterialCost: number;
  totalWorkCost: number;
  totalCost: number;
  profit?: number;
  price?: number;
}

// МойСклад types
export interface MoyskladProduct {
  id: string;
  name: string;
  code?: string;
  article?: string;
  description?: string;
  price?: number;
  quantity?: number;
  uom?: string;
}

export interface MoyskladProductsResponse {
  rows: MoyskladProduct[];
  meta: {
    size: number;
    limit: number;
    offset: number;
  };
}

export interface MoyskladStockResponse {
  rows: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
  meta: {
    size: number;
    limit: number;
    offset: number;
  };
}

export interface SyncResult {
  total: number;
  created: number;
  updated: number;
  errors: number;
  details?: string[];
} 