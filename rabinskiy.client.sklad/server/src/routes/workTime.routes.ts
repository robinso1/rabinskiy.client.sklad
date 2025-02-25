import express, { Request, Response } from 'express';
import WorkTime from '../models/workTime.model';
import User from '../models/user.model';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получение записей учета рабочего времени с возможностью фильтрации
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const { userId, orderId, startDate, endDate, approved } = req.query;
    
    // Формирование фильтра
    const filter: any = {};
    
    if (orderId) filter.order = orderId;
    
    // Фильтр по дате
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    
    // Фильтр по статусу утверждения
    if (approved !== undefined) {
      filter.approved = approved === 'true';
    }
    
    // Фильтр по пользователю (только для админов или для самого пользователя)
    if (userId) {
      if (req.userRole === 'admin' || req.userId === userId) {
        filter.user = userId;
      } else {
        return res.status(403).json({ message: 'Доступ запрещен' });
      }
    } else if (req.userRole !== 'admin') {
      // Обычные пользователи видят только свои записи
      filter.user = req.userId;
    }

    const workTimes = await WorkTime.find(filter)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber')
      .populate('approvedBy', 'username fullName')
      .sort({ date: -1 });

    res.json(workTimes);
  } catch (error) {
    console.error('Ошибка при получении записей учета рабочего времени:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении записей учета рабочего времени' });
  }
});

// Создание новой записи учета рабочего времени
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { order, date, hours, description } = req.body;

    // Получение пользователя для определения почасовой ставки
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка наличия почасовой ставки
    if (!user.hourlyRate) {
      return res.status(400).json({ message: 'У пользователя не установлена почасовая ставка' });
    }

    // Создание новой записи учета рабочего времени
    const newWorkTime = new WorkTime({
      user: req.userId,
      order,
      date: new Date(date),
      hours,
      hourlyRate: user.hourlyRate,
      description,
      approved: false
    });

    await newWorkTime.save();

    // Получение полных данных с заполненными ссылками
    const populatedWorkTime = await WorkTime.findById(newWorkTime._id)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber');

    res.status(201).json(populatedWorkTime);
  } catch (error) {
    console.error('Ошибка при создании записи учета рабочего времени:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании записи учета рабочего времени' });
  }
});

// Получение информации о конкретной записи учета рабочего времени
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const workTime = await WorkTime.findById(req.params.id)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber')
      .populate('approvedBy', 'username fullName');
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета рабочего времени не найдена' });
    }

    // Проверка прав доступа: админ может видеть все записи, 
    // обычный пользователь - только свои
    if (req.userRole !== 'admin' && workTime.user._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    res.json(workTime);
  } catch (error) {
    console.error('Ошибка при получении информации о записи учета рабочего времени:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении информации о записи учета рабочего времени' });
  }
});

// Обновление записи учета рабочего времени
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { order, date, hours, description } = req.body;
    const workTime = await WorkTime.findById(req.params.id);
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета рабочего времени не найдена' });
    }

    // Проверка прав: только владелец или админ может обновлять
    if (req.userRole !== 'admin' && workTime.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Проверка, что запись не утверждена (утвержденные записи нельзя изменять)
    if (workTime.approved) {
      return res.status(400).json({ message: 'Невозможно изменить утвержденную запись' });
    }

    // Обновление данных
    const updateData: any = {};
    if (order !== undefined) updateData.order = order;
    if (date !== undefined) updateData.date = new Date(date);
    if (hours !== undefined) updateData.hours = hours;
    if (description !== undefined) updateData.description = description;

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
    console.error('Ошибка при обновлении записи учета рабочего времени:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении записи учета рабочего времени' });
  }
});

// Удаление записи учета рабочего времени
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const workTime = await WorkTime.findById(req.params.id);
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета рабочего времени не найдена' });
    }

    // Проверка прав: только владелец или админ может удалять
    if (req.userRole !== 'admin' && workTime.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Проверка, что запись не утверждена (утвержденные записи нельзя удалять)
    if (workTime.approved) {
      return res.status(400).json({ message: 'Невозможно удалить утвержденную запись' });
    }

    await WorkTime.deleteOne({ _id: workTime._id });

    res.json({ message: 'Запись учета рабочего времени успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении записи учета рабочего времени:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении записи учета рабочего времени' });
  }
});

// Утверждение записи учета рабочего времени (только для админов)
router.patch('/:id/approve', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const workTime = await WorkTime.findById(req.params.id);
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета рабочего времени не найдена' });
    }

    // Обновление статуса утверждения
    workTime.approved = true;
    workTime.approvedBy = req.userId;
    workTime.approvedAt = new Date();

    await workTime.save();

    const updatedWorkTime = await WorkTime.findById(req.params.id)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber')
      .populate('approvedBy', 'username fullName');

    res.json(updatedWorkTime);
  } catch (error) {
    console.error('Ошибка при утверждении записи учета рабочего времени:', error);
    res.status(500).json({ message: 'Ошибка сервера при утверждении записи учета рабочего времени' });
  }
});

// Отмена утверждения записи учета рабочего времени (только для админов)
router.patch('/:id/unapprove', auth, adminOnly, async (req: Request, res: Response) => {
  try {
    const workTime = await WorkTime.findById(req.params.id);
    
    if (!workTime) {
      return res.status(404).json({ message: 'Запись учета рабочего времени не найдена' });
    }

    // Обновление статуса утверждения
    workTime.approved = false;
    workTime.approvedBy = undefined;
    workTime.approvedAt = undefined;

    await workTime.save();

    const updatedWorkTime = await WorkTime.findById(req.params.id)
      .populate('user', 'username fullName')
      .populate('order', 'orderNumber articleNumber');

    res.json(updatedWorkTime);
  } catch (error) {
    console.error('Ошибка при отмене утверждения записи учета рабочего времени:', error);
    res.status(500).json({ message: 'Ошибка сервера при отмене утверждения записи учета рабочего времени' });
  }
});

export default router; 