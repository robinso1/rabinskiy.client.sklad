// API service
import axios from 'axios';

interface UserData {
  username: string;
  fullName: string;
  email: string;
  password?: string;
}

interface OrderData {
  customer: string;
  items: Array<{
    materialId: string;
    quantity: number;
  }>;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

interface MaterialData {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
}

class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Добавляем перехватчик для добавления токена к запросам
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Добавляем перехватчик для обработки ошибок
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Методы для работы с аутентификацией
  async login(username: string, password: string) {
    const response = await this.api.post('/auth/login', { username, password });
    return response.data;
  }

  async register(userData: UserData) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // Методы для работы с заказами
  async getOrders() {
    const response = await this.api.get('/orders');
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(orderData: OrderData) {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }

  async updateOrder(id: string, orderData: Partial<OrderData>) {
    const response = await this.api.put(`/orders/${id}`, orderData);
    return response.data;
  }

  // Методы для работы с пользователями
  async getUsers() {
    const response = await this.api.get('/users');
    return response.data;
  }

  async getUserById(id: string) {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<UserData>) {
    const response = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  // Методы для работы с материалами
  async getMaterials() {
    const response = await this.api.get('/materials');
    return response.data;
  }

  async getMaterialById(id: string) {
    const response = await this.api.get(`/materials/${id}`);
    return response.data;
  }

  async createMaterial(materialData: MaterialData) {
    const response = await this.api.post('/materials', materialData);
    return response.data;
  }

  async updateMaterial(id: string, materialData: Partial<MaterialData>) {
    const response = await this.api.put(`/materials/${id}`, materialData);
    return response.data;
  }
}

export const api = new ApiService();
