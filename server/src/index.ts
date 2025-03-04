// Server entry point

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Загрузка переменных окружения
dotenv.config();

// Импорт маршрутов
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import materialRoutes from './routes/material.routes';
import operationRoutes from './routes/operation.routes';
import orderRoutes from './routes/order.routes';
import workTimeRoutes from './routes/workTime.routes';
import moyskladRoutes from './routes/moysklad.routes';
import healthRoutes from './routes/health.routes';

// Создание экземпляра приложения Express
const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabinskiy-sklad';

// Middleware
app.use(cors());
app.use(express.json());

// Статические файлы
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Маршруты API
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/worktime', workTimeRoutes);
app.use('/api/moysklad', moyskladRoutes);

// Простой маршрут для проверки работоспособности
app.get('/', (req, res) => {
  res.json({
    message: 'API сервера Рабинский Склад работает',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Обработка несуществующих маршрутов
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

// Инициализация базы данных при первом запуске
const initDb = async () => {
  if (process.env.INIT_DB === 'true') {
    try {
      const initDbScript = require('./scripts/initDb');
      await initDbScript.default();
      console.log('База данных успешно инициализирована');
    } catch (error) {
      console.error('Ошибка при инициализации базы данных:', error);
    }
  }
};

// Подключение к MongoDB и запуск сервера
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Подключение к MongoDB установлено');
    
    // Инициализация базы данных, если нужно
    await initDb();
    
    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
    process.exit(1);
  });

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('Необработанное исключение:', error);
  process.exit(1);
});

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанное отклонение промиса:', promise, 'причина:', reason);
});
