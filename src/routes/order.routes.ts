// Order routes

import express from 'express';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получить список заказов
router.get('/', auth, (req, res) => {
  // Параметры запроса: status, limit, offset
  const status = req.query.status || 'all';
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  
  res.json({
    success: true,
    message: 'Get orders endpoint',
    data: [
      {
        id: '1',
        orderNumber: 'ORD001',
        articleNumber: 'ART001',
        customer: 'Клиент 1',
        description: 'Описание заказа 1',
        status: 'in_progress',
        startDate: new Date().toISOString(),
        endDate: null,
        techProcess: {
          id: '1',
          name: 'Техпроцесс 1'
        },
        totalMaterialsCost: 10000,
        totalWorkCost: 15000,
        totalCost: 25000
      },
      {
        id: '2',
        orderNumber: 'ORD002',
        articleNumber: 'ART002',
        customer: 'Клиент 2',
        description: 'Описание заказа 2',
        status: 'completed',
        startDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
        endDate: new Date().toISOString(),
        techProcess: {
          id: '2',
          name: 'Техпроцесс 2'
        },
        totalMaterialsCost: 8000,
        totalWorkCost: 12000,
        totalCost: 20000
      }
    ],
    meta: {
      total: 2,
      limit,
      offset
    }
  });
});

// Создать новый заказ
router.post('/', auth, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Create order endpoint',
    data: {
      id: '3',
      orderNumber: req.body.orderNumber || 'ORD003',
      articleNumber: req.body.articleNumber || 'ART003',
      customer: req.body.customer || 'Новый клиент',
      description: req.body.description || '',
      status: 'created',
      startDate: new Date().toISOString(),
      endDate: null,
      techProcess: req.body.techProcess ? {
        id: req.body.techProcess,
        name: 'Техпроцесс ' + req.body.techProcess
      } : null,
      totalMaterialsCost: 0,
      totalWorkCost: 0,
      totalCost: 0
    }
  });
});

// Получить заказ по ID
router.get('/:id', auth, (req, res) => {
  res.json({
    success: true,
    message: `Get order ${req.params.id} endpoint`,
    data: {
      id: req.params.id,
      orderNumber: 'ORD00' + req.params.id,
      articleNumber: 'ART00' + req.params.id,
      customer: 'Клиент ' + req.params.id,
      description: 'Описание заказа ' + req.params.id,
      status: 'in_progress',
      startDate: new Date().toISOString(),
      endDate: null,
      techProcess: {
        id: req.params.id,
        name: 'Техпроцесс ' + req.params.id,
        operations: [
          {
            id: '1',
            name: 'Операция 1',
            description: 'Описание операции 1',
            status: 'completed',
            assignedTo: {
              id: '123456789',
              username: 'admin',
              fullName: 'Администратор'
            },
            completedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Операция 2',
            description: 'Описание операции 2',
            status: 'in_progress',
            assignedTo: {
              id: '987654321',
              username: 'worker1',
              fullName: 'Работник 1'
            },
            completedAt: null
          }
        ],
        materials: [
          {
            id: '1',
            name: 'Материал 1',
            code: 'MAT001',
            quantity: 5,
            unit: 'шт',
            price: 100,
            totalCost: 500
          }
        ]
      },
      workTime: [
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
          description: 'Работа над заказом'
        }
      ],
      totalMaterialsCost: 10000,
      totalWorkCost: 15000,
      totalCost: 25000
    }
  });
});

// Обновить статус заказа
router.patch('/:id/status', auth, adminOnly, (req, res) => {
  const newStatus = req.body.status || 'in_progress';
  
  res.json({
    success: true,
    message: `Update order ${req.params.id} status endpoint`,
    data: {
      id: req.params.id,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }
  });
});

// Назначить операцию пользователю
router.post('/:id/operations/:operationId/assign', auth, adminOnly, (req, res) => {
  const userId = req.body.userId;
  
  res.json({
    success: true,
    message: `Assign operation ${req.params.operationId} to user endpoint`,
    data: {
      orderId: req.params.id,
      operationId: req.params.operationId,
      userId,
      assignedAt: new Date().toISOString()
    }
  });
});

// Завершить операцию
router.post('/:id/operations/:operationId/complete', auth, (req, res) => {
  res.json({
    success: true,
    message: `Complete operation ${req.params.operationId} endpoint`,
    data: {
      orderId: req.params.id,
      operationId: req.params.operationId,
      completedBy: req.userId,
      completedAt: new Date().toISOString()
    }
  });
});

export default router;
