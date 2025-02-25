import express from 'express';
import User from '../models/user.model';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Получение списка всех пользователей (только для админов)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении списка пользователей' });
  }
});

// Получение информации о конкретном пользователе
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка прав: админ может видеть всех, обычный пользователь - только себя
    if (req.userRole !== 'admin' && req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    res.json(user);
  } catch (error) {
    console.error('Ошибка при получении информации о пользователе:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении информации о пользователе' });
  }
});

// Обновление информации о пользователе
router.put('/:id', auth, async (req, res) => {
  try {
    const { fullName, hourlyRate, role } = req.body;
    
    // Проверка прав: админ может обновлять всех, обычный пользователь - только себя
    if (req.userRole !== 'admin' && req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Обычный пользователь не может менять роль
    if (req.userRole !== 'admin' && role) {
      return res.status(403).json({ message: 'Недостаточно прав для изменения роли' });
    }

    const updateData: any = { fullName };
    
    // Только админ может менять почасовую ставку и роль
    if (req.userRole === 'admin') {
      if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
      if (role) updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при обновлении пользователя' });
  }
});

// Изменение пароля
router.put('/:id/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Проверка прав: пользователь может менять только свой пароль
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка текущего пароля
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный текущий пароль' });
    }

    // Обновление пароля
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Ошибка при изменении пароля:', error);
    res.status(500).json({ message: 'Ошибка сервера при изменении пароля' });
  }
});

// Удаление пользователя (только для админов)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
  }
});

export default router; 