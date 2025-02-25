// Authentication routes

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user.model';

const router = express.Router();

// Регистрация нового пользователя (только для админов)
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, role, hourlyRate } = req.body;

    // Проверка, существует ли пользователь с таким именем
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }

    // Создание нового пользователя
    const newUser = new User({
      username,
      password, // Пароль будет хешироваться в pre-save хуке модели
      fullName,
      role: role || 'worker',
      hourlyRate
    });

    await newUser.save();

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

// Вход пользователя
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    // Отправка ответа с токеном и данными пользователя (без пароля)
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        hourlyRate: user.hourlyRate
      }
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

// Получение информации о текущем пользователе
router.get('/me', async (req, res) => {
  try {
    // Получение токена из заголовка
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
    
    // Поиск пользователя
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Отправка данных пользователя
    res.json({
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      hourlyRate: user.hourlyRate
    });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении данных пользователя' });
  }
});

export default router;
