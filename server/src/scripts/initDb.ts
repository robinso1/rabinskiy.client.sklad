// Скрипт для инициализации базы данных тестовыми данными

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.model';
import Material from '../models/material.model';
import Operation from '../models/operations/operation.model';
import TechProcess from '../models/operations/techProcess.model';
import Order from '../models/order.model';
import WorkTime from '../models/workTime.model';

// Загрузка переменных окружения
dotenv.config();

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabinskiy-sklad';

async function initDb() {
  try {
    // Подключение к MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Очистка коллекций
    await User.deleteMany({});
    await Material.deleteMany({});
    await Operation.deleteMany({});
    await TechProcess.deleteMany({});
    await Order.deleteMany({});
    await WorkTime.deleteMany({});

    console.log('Существующие данные удалены');

    // Создаем администратора по умолчанию
    const admin = new User({
      username: 'admin',
      password: 'admin123', // Будет захешировано автоматически
      fullName: 'Администратор',
      role: 'admin',
      active: true
    });
    await admin.save();
    console.log('Admin user created');

    // Создаем базовые операции
    const operations = [];
    const basicOperations = [
      { name: 'Резка', defaultRate: 100 },
      { name: 'Сборка', defaultRate: 150 },
      { name: 'Покраска', defaultRate: 120 },
      { name: 'Упаковка', defaultRate: 80 }
    ];

    for (const op of basicOperations) {
      const operation = await Operation.create({
        ...op,
        active: true,
        description: `Операция ${op.name.toLowerCase()}`
      });
      operations.push(operation);
      console.log(`Operation ${op.name} created`);
    }

    console.log('Пользователи созданы');

    // Создание материалов
    const material1 = await Material.create({
      name: 'Материал 1',
      code: 'MAT001',
      unit: 'шт',
      description: 'Описание материала 1',
      price: 100,
      inStock: 50,
      moyskladId: 'ms-1'
    });

    const material2 = await Material.create({
      name: 'Материал 2',
      code: 'MAT002',
      unit: 'м²',
      description: 'Описание материала 2',
      price: 200,
      inStock: 30,
      moyskladId: 'ms-2'
    });

    console.log('Материалы созданы');

    // Создание технологического процесса
    const techProcess = await TechProcess.create({
      name: 'Техпроцесс 1',
      code: 'TP001',
      description: 'Описание техпроцесса 1',
      operations: [
        {
          operationId: operations[0]._id,
          order: 1,
          quantity: 1,
          optional: false
        },
        {
          operationId: operations[1]._id,
          order: 2,
          quantity: 1,
          optional: false
        }
      ],
      materials: [
        {
          materialId: material1._id,
          quantity: 5,
          optional: false
        }
      ],
      active: true
    });

    console.log('Технологические процессы созданы');

    // Создание заказов
    const order1 = await Order.create({
      orderNumber: 'ORD001',
      articleNumber: 'ART001',
      customer: 'Клиент 1',
      description: 'Описание заказа 1',
      status: 'in_progress',
      startDate: new Date(),
      techProcessId: techProcess._id,
      quantity: 10,
      completedQuantity: 0,
      totalMaterialsCost: 1100,
      totalWorkCost: 1600,
      totalCost: 2700,
      comments: 'Комментарий к заказу 1'
    });

    const order2 = await Order.create({
      orderNumber: 'ORD002',
      articleNumber: 'ART002',
      customer: 'Клиент 2',
      description: 'Описание заказа 2',
      status: 'completed',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 дней назад
      endDate: new Date(),
      techProcessId: techProcess._id,
      quantity: 5,
      completedQuantity: 5,
      totalMaterialsCost: 800,
      totalWorkCost: 1200,
      totalCost: 2000,
      comments: 'Комментарий к заказу 2'
    });

    console.log('Заказы созданы');

    // Создание записей учета рабочего времени
    const workTime = await WorkTime.create({
      userId: admin._id,
      orderId: order1._id,
      date: new Date(),
      hours: 8,
      hourlyRate: 200,
      totalAmount: 1600,
      description: 'Работа над заказом ORD001',
      approved: true,
      approvedBy: admin._id,
      approvedAt: new Date()
    });

    console.log('Записи учета рабочего времени созданы');

    console.log('База данных успешно инициализирована тестовыми данными');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    process.exit(1);
  }
}

// Запуск инициализации
initDb(); 