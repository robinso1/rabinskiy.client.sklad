import express from 'express';
import mongoose from 'mongoose';
import { getRenderEnvironmentInfo } from '../config/render';
import os from 'os';

const router = express.Router();

// Маршрут для проверки здоровья сервера
router.get('/', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const mongoStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  }[mongoStatus] || 'unknown';

  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: mongoStatusText,
      statusCode: mongoStatus
    },
    memory: {
      free: os.freemem(),
      total: os.totalmem(),
      usage: process.memoryUsage()
    },
    cpu: {
      load: os.loadavg(),
      cores: os.cpus().length
    },
    render: getRenderEnvironmentInfo()
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: errorMessage
    });
  }
});

// Маршрут для проверки готовности сервера
router.get('/ready', (req, res) => {
  // Проверяем, что MongoDB подключена
  const isMongoConnected = mongoose.connection.readyState === 1;
  
  if (isMongoConnected) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ 
      status: 'not ready',
      reason: 'Database connection is not established'
    });
  }
});

// Маршрут для проверки живости сервера
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

export default router; 