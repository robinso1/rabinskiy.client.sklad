// Auth routes

import express from 'express';
import { login, register, getCurrentUser } from '../controllers/auth.controller';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Авторизация пользователя
router.post('/login', login);

// Регистрация нового пользователя (только для администраторов)
router.post('/register', auth, adminOnly, register);

// Получение информации о текущем пользователе
router.get('/me', auth, getCurrentUser);

export default router;
