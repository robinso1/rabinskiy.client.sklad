import express, { Request, Response } from 'express';
import Operation from '../models/operations/operation.model';
import UserRate from '../models/operations/userRate.model';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получение списка всех операций
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const operations = await Operation.find();
    res.json(operations);
  } catch (error) {
    console.error('Ошибка при получении списка операций:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении списка операций' });
  }
});

// Создание новой операции (только для админов)
router.post('/', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { name, description, defaultRate } = req.body;

    // Проверка, существует ли операция с таким именем
    const existingOperation = await Operation.findOne({ name });
    if (existingOperation) {
      return res.status(400).json({ message: 'Операция с таким именем уже существует' });
    }

    // Создание новой операции
    const newOperation = new Operation({
      name,
      description,
      defaultRate
    });

    await newOperation.save();

    res.status(201).json(newOperation);
  } catch (error) {
    console.error('Ошибка при создании операции:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании операции' });
  }
});

// Получение информации о конкретной операции
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const operation = await Operation.findById(req.params.id);
    
    if (!operation) {
      return res.status(404).json({ message: 'Операция не найдена' });
    }

    res.json(operation);
  } catch (error) {
    console.error('Ошибка при получении информации об операции:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении информации об операции' });
  }
});

// Обновление операции (только для админов)
router.put('/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { name, description, defaultRate } = req.body;

    // Проверка, существует ли операция с таким именем (кроме текущей)
    if (name) {
      const existingOperation = await Operation.findOne({ name, _id: { $ne: req.params.id } });
      if (existingOperation) {
        return res.status(400).json({ message: 'Операция с таким именем уже существует' });
      }
    }

    const operation = await Operation.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, defaultRate } },
      { new: true }
    );

    if (!operation) {
      return res.status(404).json({ message: 'Операция не найдена' });
    }

    res.json(operation);
  } catch (error) {
    console.error('Ошибка при обновлении операции:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении операции' });
  }
});

// Удаление операции (только для админов)
router.delete('/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const operation = await Operation.findByIdAndDelete(req.params.id);
    
    if (!operation) {
      return res.status(404).json({ message: 'Операция не найдена' });
    }

    // Удаление всех индивидуальных расценок для этой операции
    await UserRate.deleteMany({ operation: req.params.id });

    res.json({ message: 'Операция успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении операции:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении операции' });
  }
});

// Получение индивидуальных расценок для операции
router.get('/:id/rates', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const rates = await UserRate.find({ operation: req.params.id }).populate('user', 'username fullName');
    res.json(rates);
  } catch (error) {
    console.error('Ошибка при получении индивидуальных расценок:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении индивидуальных расценок' });
  }
});

// Установка индивидуальной расценки для пользователя (только для админов)
router.post('/rates', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const { userId, operationId, rate } = req.body;

    // Проверка существования пользователя и операции
    const existingRate = await UserRate.findOne({ user: userId, operation: operationId });

    if (existingRate) {
      // Обновление существующей расценки
      existingRate.rate = rate;
      await existingRate.save();
      return res.json(existingRate);
    } else {
      // Создание новой расценки
      const newRate = new UserRate({
        user: userId,
        operation: operationId,
        rate
      });

      await newRate.save();
      return res.status(201).json(newRate);
    }
  } catch (error) {
    console.error('Ошибка при установке индивидуальной расценки:', error);
    res.status(500).json({ message: 'Ошибка сервера при установке индивидуальной расценки' });
  }
});

// Удаление индивидуальной расценки (только для админов)
router.delete('/rates/:id', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const rate = await UserRate.findByIdAndDelete(req.params.id);
    
    if (!rate) {
      return res.status(404).json({ message: 'Индивидуальная расценка не найдена' });
    }

    res.json({ message: 'Индивидуальная расценка успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении индивидуальной расценки:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении индивидуальной расценки' });
  }
});

export default router; 