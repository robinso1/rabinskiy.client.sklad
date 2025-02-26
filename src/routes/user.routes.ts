// User routes

import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, changePassword } from '../controllers/user.controller';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получение списка пользователей (только для администраторов)
router.get('/', auth, adminOnly, getUsers);

// Получение информации о пользователе
router.get('/:id', auth, getUserById);

// Обновление информации о пользователе (только для администраторов)
router.put('/:id', auth, adminOnly, updateUser);

// Изменение пароля пользователя
router.post('/:id/change-password', auth, changePassword);

// Удаление пользователя (только для администраторов)
router.delete('/:id', auth, adminOnly, deleteUser);

export default router; 