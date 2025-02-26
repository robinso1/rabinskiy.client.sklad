// TechProcess routes

import express from 'express';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получить список технологических процессов
router.get('/', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Get tech processes endpoint',
    data: [
      {
        id: '1',
        name: 'Техпроцесс 1',
        articleNumber: 'TP001',
        description: 'Описание техпроцесса 1',
        operations: [
          {
            operation: {
              id: '1',
              name: 'Операция 1',
              description: 'Описание операции 1',
              defaultRate: 100
            },
            order: 1,
            description: 'Шаг 1 техпроцесса'
          },
          {
            operation: {
              id: '2',
              name: 'Операция 2',
              description: 'Описание операции 2',
              defaultRate: 150
            },
            order: 2,
            description: 'Шаг 2 техпроцесса'
          }
        ],
        materials: [
          {
            material: {
              id: '1',
              name: 'Материал 1',
              code: 'MAT001',
              unit: 'шт'
            },
            quantity: 5,
            unit: 'шт',
            isOptional: false
          }
        ],
        isActive: true
      }
    ]
  });
});

// Создать новый технологический процесс
router.post('/', auth, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Create tech process endpoint',
    data: {
      id: '2',
      name: req.body.name || 'Новый техпроцесс',
      articleNumber: req.body.articleNumber || 'TP002',
      description: req.body.description || '',
      operations: req.body.operations || [],
      materials: req.body.materials || [],
      isActive: true
    }
  });
});

// Получить технологический процесс по ID
router.get('/:id', auth, (req, res) => {
  res.json({
    success: true,
    message: `Get tech process ${req.params.id} endpoint`,
    data: {
      id: req.params.id,
      name: 'Техпроцесс ' + req.params.id,
      articleNumber: 'TP00' + req.params.id,
      description: 'Описание техпроцесса ' + req.params.id,
      operations: [
        {
          operation: {
            id: '1',
            name: 'Операция 1',
            description: 'Описание операции 1',
            defaultRate: 100
          },
          order: 1,
          description: 'Шаг 1 техпроцесса'
        },
        {
          operation: {
            id: '2',
            name: 'Операция 2',
            description: 'Описание операции 2',
            defaultRate: 150
          },
          order: 2,
          description: 'Шаг 2 техпроцесса'
        }
      ],
      materials: [
        {
          material: {
            id: '1',
            name: 'Материал 1',
            code: 'MAT001',
            unit: 'шт'
          },
          quantity: 5,
          unit: 'шт',
          isOptional: false
        }
      ],
      isActive: true
    }
  });
});

// Получить технологический процесс по артикулу
router.get('/article/:articleNumber', auth, (req, res) => {
  res.json({
    success: true,
    message: `Get tech process by article ${req.params.articleNumber} endpoint`,
    data: {
      id: '1',
      name: 'Техпроцесс для артикула ' + req.params.articleNumber,
      articleNumber: req.params.articleNumber,
      description: 'Описание техпроцесса для артикула ' + req.params.articleNumber,
      operations: [
        {
          operation: {
            id: '1',
            name: 'Операция 1',
            description: 'Описание операции 1',
            defaultRate: 100
          },
          order: 1,
          description: 'Шаг 1 техпроцесса'
        }
      ],
      materials: [
        {
          material: {
            id: '1',
            name: 'Материал 1',
            code: 'MAT001',
            unit: 'шт'
          },
          quantity: 5,
          unit: 'шт',
          isOptional: false
        }
      ],
      isActive: true
    }
  });
});

export default router; 