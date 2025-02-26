// Operation routes

import express from 'express';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получить список операций
router.get('/', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Get operations endpoint',
    data: [
      {
        id: '1',
        name: 'Операция 1',
        description: 'Описание операции 1',
        defaultRate: 100
      },
      {
        id: '2',
        name: 'Операция 2',
        description: 'Описание операции 2',
        defaultRate: 150
      }
    ]
  });
});

// Создать новую операцию
router.post('/', auth, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Create operation endpoint',
    data: {
      id: '3',
      name: req.body.name || 'Новая операция',
      description: req.body.description || '',
      defaultRate: req.body.defaultRate || 100
    }
  });
});

// Получить операцию по ID
router.get('/:id', auth, (req, res) => {
  res.json({
    success: true,
    message: `Get operation ${req.params.id} endpoint`,
    data: {
      id: req.params.id,
      name: 'Операция ' + req.params.id,
      description: 'Описание операции ' + req.params.id,
      defaultRate: 100 * parseInt(req.params.id)
    }
  });
});

export default router; 