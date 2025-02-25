// Server entry point

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Загрузка переменных окружения
dotenv.config();

// Импорт маршрутов
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';
import operationRoutes from './routes/operation.routes';
import materialRoutes from './routes/material.routes';
import techProcessRoutes from './routes/techProcess.routes';
import workTimeRoutes from './routes/workTime.routes';
import reportRoutes from './routes/report.routes';
import moyskladRoutes from './routes/moysklad.routes';
import healthRoutes from './routes/health.routes';

// Создание экземпляра приложения Express
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Статические файлы
app.use(express.static(path.join(__dirname, '../../client/build')));

// Маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/tech-processes', techProcessRoutes);
app.use('/api/work-time', workTimeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/moysklad', moyskladRoutes);
app.use('/api/health', healthRoutes);

// Маршрут для SPA (React)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// Определение MongoDB URI
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabinskiy-sklad';

// Если заданы отдельные параметры подключения, формируем строку подключения
if (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD && process.env.MONGODB_HOST) {
  const username = encodeURIComponent(process.env.MONGODB_USERNAME);
  const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
  const host = process.env.MONGODB_HOST;
  const port = process.env.MONGODB_PORT || '27017';
  const database = process.env.MONGODB_DATABASE || 'rabinskiy-sklad';
  
  MONGODB_URI = `mongodb://${username}:${password}@${host}:${port}/${database}`;
}

// Настройки подключения к MongoDB с увеличенными таймаутами
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // 30 секунд
  socketTimeoutMS: 45000, // 45 секунд
  connectTimeoutMS: 30000, // 30 секунд
};

// Запуск сервера перед подключением к MongoDB
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Логирование URI без пароля для безопасности
  const sanitizedUri = MONGODB_URI.replace(
    /mongodb:\/\/([^:]+):([^@]+)@/,
    'mongodb://$1:****@'
  );
  console.log(`Connecting to MongoDB: ${sanitizedUri}`);
  
  // Подключение к MongoDB после запуска сервера
  mongoose
    .connect(MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log('MongoDB connected successfully');
      
      // Инициализация базы данных в production режиме, если задана переменная INIT_DB
      if (process.env.NODE_ENV === 'production' && process.env.INIT_DB === 'true') {
        try {
          const initDb = require('./utils/initDb');
          initDb().then(() => {
            console.log('Database initialized successfully');
          }).catch((err: Error) => {
            console.error('Database initialization error:', err);
          });
        } catch (error) {
          console.error('Error loading initDb module:', error);
        }
      }
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      // Сервер продолжит работу даже при ошибке подключения к БД
    });
});

// Обработка завершения работы
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close().then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    }).catch((err) => {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    });
  });
});

// Обработка необработанных исключений и отклоненных промисов
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
