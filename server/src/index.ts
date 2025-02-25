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
app.use(express.static(path.join(__dirname, '../public')));

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

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Обработка всех остальных маршрутов (для SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Запуск сервера до подключения к MongoDB, чтобы Render мог обнаружить открытый порт
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabinskiy-sklad';
console.log('Connecting to MongoDB at:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Логируем URI без пароля

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    // Не завершаем процесс, чтобы сервер продолжал работать даже без БД
    console.log('Server will continue running without database connection');
  });

// Обработка сигналов завершения
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
