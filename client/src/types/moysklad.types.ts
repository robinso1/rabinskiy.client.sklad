/**
 * Типы для работы с МойСклад API
 */

// Тип для товара из МойСклад
export interface MoyskladProduct {
  id: string;
  name: string;
  code?: string;
  article?: string;
  description?: string;
  price?: number;
  quantity?: number;
  unit: string;
}

// Тип для ответа API со списком товаров
export interface MoyskladProductsResponse {
  success: boolean;
  message?: string;
  data?: MoyskladProduct[];
  meta?: {
    size: number;
    limit: number;
    offset: number;
  };
  errors?: string[];
}

// Тип для ответа API с информацией о соединении
export interface MoyskladConnectionResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

// Тип для результата синхронизации
export interface SyncResult {
  total: number;
  created: number;
  updated: number;
  errors: number;
  details?: string[];
}

// Тип для ответа API с результатом синхронизации
export interface MoyskladSyncResponse {
  success: boolean;
  message?: string;
  data?: SyncResult;
  errors?: string[];
}

// Общий тип для ответов API МойСклад
export type MoyskladApiResponse = 
  | MoyskladConnectionResponse 
  | MoyskladProductsResponse 
  | MoyskladSyncResponse; 