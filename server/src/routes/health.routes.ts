// Health check routes

import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Маппинг состояний подключения к MongoDB
const dbStateMap: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
  99: 'uninitialized'
};

/**
 * @route GET /api/health
 * @desc Проверка работоспособности сервера
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @route GET /api/health/db
 * @desc Проверка подключения к базе данных
 * @access Public
 */
router.get('/db', (req: Request, res: Response) => {
  try {
    const dbState = mongoose.connection.readyState;
    res.status(200).json({
      status: 'ok',
      database: {
        state: dbState,
        stateText: dbStateMap[dbState] || 'unknown'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    res.status(500).json({
      status: 'error',
      database: {
        state: 99,
        stateText: dbStateMap[99] || 'unknown',
        error: errorMessage
      },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/health/env
 * @desc Проверка переменных окружения
 * @access Public
 */
router.get('/env', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

export default router; 