// Material routes

import express from 'express';
import { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from '../controllers/material.controller';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получение списка материалов
router.get('/', auth, getMaterials);

// Получение информации о материале
router.get('/:id', auth, getMaterialById);

// Создание нового материала (только для администраторов)
router.post('/', auth, adminOnly, createMaterial);

// Обновление информации о материале (только для администраторов)
router.put('/:id', auth, adminOnly, updateMaterial);

// Удаление материала (только для администраторов)
router.delete('/:id', auth, adminOnly, deleteMaterial);

export default router; 