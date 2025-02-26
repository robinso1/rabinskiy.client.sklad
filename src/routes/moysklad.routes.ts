// MoySklad routes

import express from 'express';
import { checkConnection, getProducts, importProducts, syncStock } from '../controllers/moysklad.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Получить список товаров из МойСклад
router.get('/products', auth, getProducts);

// Импортировать товары из МойСклад в локальную базу данных
router.post('/import/products', auth, importProducts);

// Синхронизировать остатки материалов с МойСклад (POST)
router.post('/sync/stock', auth, syncStock);

// Синхронизировать остатки материалов с МойСклад (GET)
router.get('/sync/stock', auth, syncStock);

// Добавляем поддержку URL с дефисом для обратной совместимости
router.get('/sync-stock', auth, syncStock);

// Проверить соединение с МойСклад API
router.get('/check-connection', auth, checkConnection);

export default router;
