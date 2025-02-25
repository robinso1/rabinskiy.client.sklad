// Health check routes

import express from 'express';

const router = express.Router();

// Простой эндпоинт для проверки здоровья сервера
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

export default router; 