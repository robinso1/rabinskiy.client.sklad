// Типы данных для проекта

// Роли пользователей
export type UserRole = 'admin' | 'worker';

// Статусы заказов
export type OrderStatus = 'created' | 'in_progress' | 'completed' | 'cancelled';

// Статусы операций
export type OperationStatus = 'pending' | 'in_progress' | 'completed';

// Интерфейс пользователя (без пароля и служебных полей)
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  hourlyRate?: number;
}

// Интерфейс операции
export interface Operation {
  id: string;
  name: string;
  description?: string;
  defaultRate: number;
}

// Интерфейс материала
export interface Material {
  id: string;
  name: string;
  code: string;
  unit: string;
  description?: string;
  price?: number;
  inStock?: number;
  moyskladId?: string;
}

// Интерфейс операции в заказе
export interface OrderOperation {
  id?: string;
  operation: Operation | string;
  quantity: number;
  completedQuantity: number;
  rate: number;
  assignedTo?: User | string;
  completionDate?: Date | string;
  comments?: string;
  status: OperationStatus;
}

// Интерфейс материала в заказе
export interface OrderMaterial {
  id?: string;
  material: Material | string;
  quantity: number;
  unit: string;
}

// Интерфейс дочернего заказа
export interface ChildOrder {
  orderId: string;
  reason: string;
  quantity: number;
}

// Интерфейс заказа
export interface Order {
  id: string;
  orderNumber: string;
  articleNumber: string;
  quantity: number;
  operations: OrderOperation[];
  materials: OrderMaterial[];
  status: OrderStatus;
  startDate: Date | string;
  endDate?: Date | string;
  comments?: string;
  parentOrder?: Order | string;
  childOrders?: ChildOrder[];
}

// Интерфейс технологического процесса
export interface TechProcess {
  id: string;
  name: string;
  articleNumber: string;
  description?: string;
  operations: TechProcessOperation[];
  materials: TechProcessMaterial[];
  isActive: boolean;
}

// Интерфейс операции в техпроцессе
export interface TechProcessOperation {
  operation: Operation | string;
  order: number;
  description?: string;
}

// Интерфейс материала в техпроцессе
export interface TechProcessMaterial {
  material: Material | string;
  quantity: number;
  unit: string;
  isOptional: boolean;
}

// Интерфейс учета рабочего времени
export interface WorkTime {
  id: string;
  user: User | string;
  order?: Order | string;
  date: Date | string;
  hours: number;
  hourlyRate: number;
  description: string;
  approved: boolean;
  approvedBy?: User | string;
  approvedAt?: Date | string;
}

// Интерфейс индивидуальной расценки
export interface UserRate {
  id: string;
  user: User | string;
  operation: Operation | string;
  rate: number;
}

// Интерфейс для авторизации
export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Интерфейс для фильтрации заказов
export interface OrderFilter {
  userId?: string;
  orderNumber?: string;
  articleNumber?: string;
  status?: OrderStatus;
  startDate?: Date | string;
  endDate?: Date | string;
}

// Интерфейс для расчета заработной платы
export interface SalaryReport {
  userId: string;
  userName: string;
  period: {
    startDate: Date | string;
    endDate: Date | string;
  };
  pieceworkSalary: number; // Сдельная оплата
  hourlySalary: number; // Почасовая оплата
  totalSalary: number; // Общая сумма
  operations: {
    operationId: string;
    operationName: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
  workTime: {
    date: Date | string;
    hours: number;
    rate: number;
    total: number;
    description: string;
  }[];
}
