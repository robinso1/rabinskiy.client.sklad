// API Types

import { Types } from 'mongoose';

// Общие типы
export type UserRole = 'admin' | 'worker';
export type OrderStatus = 'created' | 'in_progress' | 'completed' | 'cancelled';
export type OperationStatus = 'pending' | 'in_progress' | 'completed';

// Типы для МойСклад API
export interface MoyskladProduct {
  id: string;
  name: string;
  code?: string;
  article?: string;
  description?: string;
  price?: number;
  quantity?: number;
  uom?: {
    name: string;
    id: string;
  };
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

// Типы для API ответов
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
} 