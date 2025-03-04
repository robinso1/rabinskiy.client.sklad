// Health check routes

import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route GET /api/health
 * @desc Проверка работоспособности сервера
 * @access Public
 */
router.get('/', (req, res) => {
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
router.get('/db', async (req, res) => {
  try {
    // Проверяем состояние подключения к MongoDB
    const dbState = mongoose.connection.readyState;
    const dbStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    if (dbState === 1) {
      res.status(200).json({
        status: 'ok',
        database: dbStateMap[dbState],
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'error',
        database: dbStateMap[dbState],
        timestamp: new Date().toISOString(),
        message: 'Database connection is not established'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Error checking database connection',
      error: error.message
    });
  }
});

export default router; 