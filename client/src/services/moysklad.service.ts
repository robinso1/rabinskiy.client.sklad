// MoySklad service

import axios from 'axios';
import { getAuthToken } from '../utils/auth.utils';
import { 
  MoyskladConnectionResponse, 
  MoyskladProductsResponse, 
  MoyskladSyncResponse,
  SyncResult
} from '../types/moysklad.types';

/**
 * Сервис для работы с API МойСклад
 */
class MoyskladService {
  private API_URL = '/api/moysklad';

  /**
   * Получение заголовков авторизации для запросов
   * @returns {Object} Заголовки с токеном авторизации
   */
  private getAuthHeaders() {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  /**
   * Проверка соединения с МойСклад API
   * @returns {Promise<MoyskladConnectionResponse>} Результат проверки соединения
   */
  async checkConnection(): Promise<MoyskladConnectionResponse> {
    try {
      const response = await axios.get<MoyskladConnectionResponse>(
        `${this.API_URL}/check-connection`, 
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data as MoyskladConnectionResponse;
      }
      return {
        success: false,
        message: 'Ошибка при проверке соединения с МойСклад',
        errors: [error.message]
      };
    }
  }

  /**
   * Получение списка товаров из МойСклад
   * @param {number} limit - Лимит товаров на странице
   * @param {number} offset - Смещение для пагинации
   * @returns {Promise<MoyskladProductsResponse>} Список товаров
   */
  async getProducts(limit = 100, offset = 0): Promise<MoyskladProductsResponse> {
    try {
      const response = await axios.get<MoyskladProductsResponse>(
        `${this.API_URL}/products`, 
        {
          ...this.getAuthHeaders(),
          params: { limit, offset }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data as MoyskladProductsResponse;
      }
      return {
        success: false,
        message: 'Ошибка при получении товаров из МойСклад',
        errors: [error.message],
        data: [],
        meta: { size: 0, limit, offset }
      };
    }
  }

  /**
   * Импорт товаров из МойСклад в локальную базу данных
   * @returns {Promise<MoyskladSyncResponse>} Результат импорта
   */
  async importProducts(): Promise<MoyskladSyncResponse> {
    try {
      const response = await axios.post<MoyskladSyncResponse>(
        `${this.API_URL}/import-products`, 
        {}, 
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data as MoyskladSyncResponse;
      }
      const emptyResult: SyncResult = {
        total: 0,
        created: 0,
        updated: 0,
        errors: 0,
        details: []
      };
      return {
        success: false,
        message: 'Ошибка при импорте товаров из МойСклад',
        errors: [error.message],
        data: emptyResult
      };
    }
  }

  /**
   * Синхронизация остатков материалов с МойСклад
   * @returns {Promise<MoyskladSyncResponse>} Результат синхронизации
   */
  async syncStock(): Promise<MoyskladSyncResponse> {
    try {
      const response = await axios.post<MoyskladSyncResponse>(
        `${this.API_URL}/sync-stock`, 
        {}, 
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data as MoyskladSyncResponse;
      }
      const emptyResult: SyncResult = {
        total: 0,
        created: 0,
        updated: 0,
        errors: 0,
        details: []
      };
      return {
        success: false,
        message: 'Ошибка при синхронизации остатков с МойСклад',
        errors: [error.message],
        data: emptyResult
      };
    }
  }
}

export default new MoyskladService();
