// WorkTime routes

import express from 'express';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получить записи учета рабочего времени
router.get('/', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Get work time records endpoint',
    data: [
      {
        id: '1',
        user: {
          id: '123456789',
          username: 'admin',
          fullName: 'Администратор'
        },
        order: {
          id: '1',
          orderNumber: 'ORD001',
          articleNumber: 'ART001'
        },
        date: new Date().toISOString(),
        hours: 8,
        hourlyRate: 200,
        description: 'Работа над заказом ORD001',
        approved: true,
        approvedBy: {
          id: '123456789',
          username: 'admin',
          fullName: 'Администратор'
        },
        approvedAt: new Date().toISOString()
      }
    ]
  });
});

// Создать новую запись учета рабочего времени
router.post('/', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Create work time record endpoint',
    data: {
      id: '2',
      user: {
        id: req.userId,
        username: 'user',
        fullName: 'Пользователь'
      },
      order: req.body.order ? {
        id: req.body.order,
        orderNumber: 'ORD' + req.body.order,
        articleNumber: 'ART' + req.body.order
      } : null,
      date: req.body.date || new Date().toISOString(),
      hours: req.body.hours || 8,
      hourlyRate: 200,
      description: req.body.description || 'Работа',
      approved: false
    }
  });
});

export default router; 