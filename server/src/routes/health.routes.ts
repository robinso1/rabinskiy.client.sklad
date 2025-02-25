// Health check routes

import { Router } from 'express';

const router = Router();

/**
 * @route GET /api/health
 * @desc Проверка работоспособности сервера
 * @access Public
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * @route GET /api/health/db
 * @desc Проверка подключения к базе данных
 * @access Public
 */
router.get('/db', (req, res) => {
  const mongoose = require('mongoose');
  
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({
      status: 'success',
      message: 'Database connection is healthy',
      dbState: 'connected',
      timestamp: new Date().toISOString(),
    });
  } else {
    return res.status(503).json({
      status: 'error',
      message: 'Database connection is not established',
      dbState: mongoose.connection.readyState === 0 ? 'disconnected' : 
               mongoose.connection.readyState === 2 ? 'connecting' : 'disconnecting',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router; 