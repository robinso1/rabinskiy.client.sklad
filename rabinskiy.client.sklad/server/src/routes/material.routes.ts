import express, { Request, Response } from 'express';
import Material from '../models/material.model';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получение списка всех материалов
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    console.error('Ошибка при получении списка материалов:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении списка материалов' });
  }
});

// Создание нового материала (только для админов)
router.post('/', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { name, code, unit, description, price, inStock, moyskladId } = req.body;

    // Проверка, существует ли материал с таким кодом
    const existingMaterial = await Material.findOne({ code });
    if (existingMaterial) {
      return res.status(400).json({ message: 'Материал с таким кодом уже существует' });
    }

    // Создание нового материала
    const newMaterial = new Material({
      name,
      code,
      unit,
      description,
      price,
      inStock,
      moyskladId
    });

    await newMaterial.save();

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error('Ошибка при создании материала:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании материала' });
  }
});

// Получение информации о конкретном материале
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Материал не найден' });
    }

    res.json(material);
  } catch (error) {
    console.error('Ошибка при получении информации о материале:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении информации о материале' });
  }
});

// Обновление материала (только для админов)
router.put('/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { name, code, unit, description, price, inStock, moyskladId } = req.body;

    // Проверка, существует ли материал с таким кодом (кроме текущего)
    if (code) {
      const existingMaterial = await Material.findOne({ code, _id: { $ne: req.params.id } });
      if (existingMaterial) {
        return res.status(400).json({ message: 'Материал с таким кодом уже существует' });
      }
    }

    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $set: { name, code, unit, description, price, inStock, moyskladId } },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ message: 'Материал не найден' });
    }

    res.json(material);
  } catch (error) {
    console.error('Ошибка при обновлении материала:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении материала' });
  }
});

// Удаление материала (только для админов)
router.delete('/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Материал не найден' });
    }

    res.json({ message: 'Материал успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении материала:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении материала' });
  }
});

// Обновление количества материала на складе (только для админов)
router.patch('/:id/stock', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { inStock } = req.body;

    if (inStock === undefined) {
      return res.status(400).json({ message: 'Необходимо указать количество материала' });
    }

    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $set: { inStock } },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ message: 'Материал не найден' });
    }

    res.json(material);
  } catch (error) {
    console.error('Ошибка при обновлении количества материала:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении количества материала' });
  }
});

export default router; 