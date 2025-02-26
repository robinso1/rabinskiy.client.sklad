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
// Временно закомментируем маршруты, которые вызывают ошибки
// import userRoutes from './routes/user.routes';
// import orderRoutes from './routes/order.routes';
// import operationRoutes from './routes/operation.routes';
// import materialRoutes from './routes/material.routes';
// import techProcessRoutes from './routes/techProcess.routes';
// import workTimeRoutes from './routes/workTime.routes';
// import reportRoutes from './routes/report.routes';
// import moyskladRoutes from './routes/moysklad.routes';
// import healthRoutes from './routes/health.routes';

// Создание экземпляра приложения Express
const app = express();
const PORT = process.env.PORT || 5000;
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
app.use('/api/auth', authRoutes);
// Временно закомментируем маршруты, которые вызывают ошибки
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/operations', operationRoutes);
// app.use('/api/materials', materialRoutes);
// app.use('/api/tech-processes', techProcessRoutes);
// app.use('/api/work-time', workTimeRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/moysklad', moyskladRoutes);
// app.use('/api/health', healthRoutes);

// Простой маршрут для проверки работоспособности
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Подключение к MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Запуск сервера
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Обработка завершения работы
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close().then(() => {
          process.exit(0);
        });
      });
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Обработка необработанных исключений и отклоненных промисов
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
