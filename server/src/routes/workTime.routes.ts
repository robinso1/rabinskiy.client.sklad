// WorkTime routes

import express from 'express';
import mongoose from 'mongoose';
import WorkTime, { IWorkTime } from '../models/workTime.model';
import User from '../models/user.model';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Сравнение userId с ObjectId
function compareIds(id1: string | mongoose.Types.ObjectId, id2: string | mongoose.Types.ObjectId): boolean {
  return id1.toString() === id2.toString();
}

// Получение записей учета рабочего времени с возможностью фильтрации
router.get('/', auth, async (req, res) => {
  try {
    const { userId, orderId, startDate, endDate, approved } = req.query;
    
    const filter: mongoose.FilterQuery<IWorkTime> = {};

    if (userId) {
      filter.user = new mongoose.Types.ObjectId(userId as string);
    }

    if (orderId) {
      filter.order = new mongoose.Types.ObjectId(orderId as string);
    }

    if (startDate) {
      filter.date = { $gte: new Date(startDate as string) };
    }

    if (endDate) {
      filter.date = { ...filter.date, $lte: new Date(endDate as string) };
    }

    if (approved !== undefined) {
      filter.approved = approved === 'true';
    }

    // Если пользователь не админ, показываем только его записи
    if (req.userRole !== 'admin') {
      filter.user = new mongoose.Types.ObjectId(req.userId as string);
    }

    const workTimeRecords = await WorkTime.find(filter)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber')
      .populate('approvedBy', 'username fullName')
      .sort({ date: -1 });

    res.json(workTimeRecords);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении записей учета времени' });
  }
});

// Создание новой записи учета времени
router.post('/', auth, async (req, res) => {
  try {
    const { order, date, hours, description } = req.body;

    // Получение пользователя для определения почасовой ставки
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const workTime = new WorkTime({
      user: new mongoose.Types.ObjectId(req.userId as string),
      order: order ? new mongoose.Types.ObjectId(order) : undefined,
      date,
      hours,
      hourlyRate: user.hourlyRate || 0,
      description,
      approved: false
    });

    await workTime.save();

    const populatedWorkTime = await WorkTime.findById(workTime._id)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber');

    res.status(201).json(populatedWorkTime);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании записи учета времени' });
  }
});

// Получение конкретной записи учета времени
router.get('/:id', auth, async (req, res) => {
  try {
    const workTime = await WorkTime.findById(req.params.id)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber')
      .populate('approvedBy', 'username fullName');

    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета времени не найдена' });
    }

    // Проверка прав доступа
    if (req.userRole !== 'admin' && !compareIds(workTime.user._id, req.userId)) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    res.json(workTime);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении записи учета времени' });
  }
});

// Обновление записи учета времени
router.put('/:id', auth, async (req, res) => {
  try {
    const { order, date, hours, description } = req.body;
    const workTime = await WorkTime.findById(req.params.id);
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета времени не найдена' });
    }

    // Проверка прав доступа
    if (req.userRole !== 'admin' && !compareIds(workTime.user, req.userId)) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Если запись уже утверждена, только админ может её изменять
    if (workTime.approved && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Нельзя изменять утвержденную запись' });
    }

    const updateData: Partial<IWorkTime> = {
      order: order ? new mongoose.Types.ObjectId(order) : workTime.order,
      date: date || workTime.date,
      hours: hours || workTime.hours,
      description: description || workTime.description
    };

    const updatedWorkTime = await WorkTime.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber')
      .populate('approvedBy', 'username fullName');

    res.json(updatedWorkTime);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении записи учета времени' });
  }
});

// Удаление записи учета времени
router.delete('/:id', auth, async (req, res) => {
  try {
    const workTime = await WorkTime.findById(req.params.id);
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета времени не найдена' });
    }

    // Проверка прав доступа
    if (req.userRole !== 'admin' && !compareIds(workTime.user, req.userId)) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Если запись уже утверждена, только админ может её удалять
    if (workTime.approved && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Нельзя удалять утвержденную запись' });
    }

    await WorkTime.findByIdAndDelete(req.params.id);
    res.json({ message: 'Запись учета времени удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении записи учета времени' });
  }
});

// Утверждение записи учета времени (только для администраторов)
router.patch('/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const workTime = await WorkTime.findById(req.params.id);
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета времени не найдена' });
    }

    workTime.approved = true;
    workTime.approvedBy = new mongoose.Types.ObjectId(req.userId as string);
    workTime.approvedAt = new Date();

    await workTime.save();

    const updatedWorkTime = await WorkTime.findById(req.params.id)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber')
      .populate('approvedBy', 'username fullName');

    res.json(updatedWorkTime);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при утверждении записи учета времени' });
  }
});

// Отмена утверждения записи учета времени (только для администраторов)
router.patch('/:id/unapprove', auth, adminOnly, async (req, res) => {
  try {
    const workTime = await WorkTime.findById(req.params.id);
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета времени не найдена' });
    }

    workTime.approved = false;
    workTime.approvedBy = undefined;
    workTime.approvedAt = undefined;

    await workTime.save();

    const updatedWorkTime = await WorkTime.findById(req.params.id)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber');

    res.json(updatedWorkTime);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при отмене утверждения записи учета времени' });
  }
});

export default router; 