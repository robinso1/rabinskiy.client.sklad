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

// Создание экземпляра Express
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabinskiy-sklad';

// Middleware
app.use(cors());
app.use(express.json());

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

// Обслуживание статических файлов в production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Подключение к MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
