// Report routes

import express, { Router } from 'express';
import { auth, adminOnly } from '../middleware/auth.middleware';

// Функция для корректного сравнения идентификаторов (строка или ObjectId)
function compareIds(id1: any, id2: any): boolean {
  if (!id1 || !id2) return false;
  return id1.toString() === id2.toString();
}

const router = Router();

// Получить список доступных отчетов
router.get('/', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Get available reports endpoint',
    data: [
      {
        id: 'work-time',
        name: 'Отчет по учету рабочего времени',
        description: 'Отчет по затраченному времени сотрудников на заказы'
      },
      {
        id: 'materials',
        name: 'Отчет по материалам',
        description: 'Отчет по использованию материалов в заказах'
      },
      {
        id: 'orders',
        name: 'Отчет по заказам',
        description: 'Отчет по выполненным и текущим заказам'
      }
    ]
  });
});

// Получить отчет по учету рабочего времени
router.get('/work-time', auth, (req, res) => {
  // Параметры запроса: startDate, endDate, userId
  const startDate = req.query.startDate || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
  const endDate = req.query.endDate || new Date().toISOString();
  const userId = req.query.userId as string;
  
  // Проверка прав доступа: админ может видеть отчеты всех пользователей, 
  // обычный пользователь - только свой
  if (userId && req.userRole !== 'admin' && !compareIds(userId, req.userId)) {
    return res.status(403).json({ 
      success: false,
      message: 'Доступ запрещен'
    });
  }
  
  res.json({
    success: true,
    message: 'Work time report',
    data: {
      startDate,
      endDate,
      userId: req.query.userId,
      totalHours: 160,
      totalAmount: 32000,
      records: [
        {
          id: '1',
          user: {
            id: '123456789',
            username: 'admin',
            fullName: 'Администратор'
          },
          date: new Date().toISOString(),
          hours: 8,
          hourlyRate: 200,
          amount: 1600,
          order: {
            id: '1',
            orderNumber: 'ORD001',
            articleNumber: 'ART001'
          }
        }
      ]
    }
  });
});

// Получить отчет по материалам
router.get('/materials', auth, (req, res) => {
  // Параметры запроса: startDate, endDate
  const startDate = req.query.startDate || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
  const endDate = req.query.endDate || new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Materials report',
    data: {
      startDate,
      endDate,
      totalMaterials: 10,
      totalAmount: 15000,
      materials: [
        {
          id: '1',
          name: 'Материал 1',
          code: 'MAT001',
          unit: 'шт',
          totalQuantity: 50,
          totalAmount: 5000,
          orders: [
            {
              id: '1',
              orderNumber: 'ORD001',
              quantity: 20,
              amount: 2000
            },
            {
              id: '2',
              orderNumber: 'ORD002',
              quantity: 30,
              amount: 3000
            }
          ]
        }
      ]
    }
  });
});

// Получить отчет по заказам
router.get('/orders', auth, (req, res) => {
  // Параметры запроса: startDate, endDate, status
  const startDate = req.query.startDate || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
  const endDate = req.query.endDate || new Date().toISOString();
  const status = req.query.status || 'all';
  
  res.json({
    success: true,
    message: 'Orders report',
    data: {
      startDate,
      endDate,
      status,
      totalOrders: 5,
      completedOrders: 3,
      inProgressOrders: 2,
      totalAmount: 50000,
      orders: [
        {
          id: '1',
          orderNumber: 'ORD001',
          articleNumber: 'ART001',
          customer: 'Клиент 1',
          status: 'completed',
          startDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
          endDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
          totalMaterialsCost: 10000,
          totalWorkCost: 15000,
          totalCost: 25000
        },
        {
          id: '2',
          orderNumber: 'ORD002',
          articleNumber: 'ART002',
          customer: 'Клиент 2',
          status: 'in_progress',
          startDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
          endDate: null,
          totalMaterialsCost: 8000,
          totalWorkCost: 12000,
          totalCost: 20000
        }
      ]
    }
  });
});

// Получить отчет по заказу по ID
router.get('/orders/:id', auth, (req, res) => {
  const orderId = req.params.id;
  
  // Здесь будет логика получения отчета по заказу
  // В данном примере возвращаем тестовые данные
  res.json({
    success: true,
    message: `Отчет по заказу ${orderId}`,
    data: {
      id: orderId,
      orderNumber: `ORD00${orderId}`,
      articleNumber: `ART00${orderId}`,
      customer: `Клиент ${orderId}`,
      description: `Описание заказа ${orderId}`,
      status: 'in_progress',
      startDate: new Date(),
      materials: [
        {
          id: '1',
          name: 'Материал 1',
          code: 'MAT001',
          unit: 'шт',
          quantity: 5,
          price: 100,
          totalCost: 500
        },
        {
          id: '2',
          name: 'Материал 2',
          code: 'MAT002',
          unit: 'м²',
          quantity: 3,
          price: 200,
          totalCost: 600
        }
      ],
      workTime: [
        {
          id: '1',
          user: {
            id: '123456789',
            username: 'admin',
            fullName: 'Администратор'
          },
          date: new Date(),
          hours: 8,
          hourlyRate: 200,
          totalCost: 1600,
          description: `Работа над заказом ORD00${orderId}`
        }
      ],
      totalMaterialsCost: 1100,
      totalWorkCost: 1600,
      totalCost: 2700
    }
  });
});

// Получить отчет по материалам
router.get('/materials', auth, adminOnly, (req, res) => {
  // Здесь будет логика получения отчета по материалам
  // В данном примере возвращаем тестовые данные
  res.json({
    success: true,
    message: 'Отчет по материалам',
    data: {
      date: new Date(),
      materials: [
        {
          id: '1',
          name: 'Материал 1',
          code: 'MAT001',
          unit: 'шт',
          inStock: 50,
          price: 100,
          totalValue: 5000
        },
        {
          id: '2',
          name: 'Материал 2',
          code: 'MAT002',
          unit: 'м²',
          inStock: 30,
          price: 200,
          totalValue: 6000
        }
      ],
      totalMaterialsValue: 11000
    }
  });
});

// Получить отчет по рабочему времени
router.get('/work-time', auth, adminOnly, (req, res) => {
  // Здесь будет логика получения отчета по рабочему времени
  // В данном примере возвращаем тестовые данные
  res.json({
    success: true,
    message: 'Отчет по рабочему времени',
    data: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
      users: [
        {
          id: '123456789',
          username: 'admin',
          fullName: 'Администратор',
          totalHours: 160,
          totalCost: 32000
        },
        {
          id: '987654321',
          username: 'worker1',
          fullName: 'Работник 1',
          totalHours: 168,
          totalCost: 25200
        }
      ],
      totalHours: 328,
      totalCost: 57200
    }
  });
});

export default router;
