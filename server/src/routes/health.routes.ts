// Health check routes

import express, { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

/**
 * @route GET /api/health
 * @desc Проверка работоспособности сервера
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

/**
 * @route GET /api/health/db
 * @desc Проверка подключения к базе данных
 * @access Public
 */
router.get('/db', (req: Request, res: Response) => {
  // Проверка состояния подключения к MongoDB
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbState = mongoose.connection.readyState;
  
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  
  const isConnected = dbState === 1;
  const stateString = states[dbState] || 'unknown';
  
  if (isConnected) {
    return res.status(200).json({
      status: 'ok',
      message: 'Database connection is healthy',
      dbState: stateString,
      timestamp: new Date().toISOString(),
    });
  } else {
    return res.status(503).json({
      status: 'error',
      message: 'Database connection is not established',
      dbState: stateString,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router; 