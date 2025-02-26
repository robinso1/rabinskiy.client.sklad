// Authentication controller

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Авторизация пользователя
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Проверка наличия обязательных полей
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать имя пользователя и пароль',
        errors: ['Необходимо указать имя пользователя и пароль']
      });
    }

    // Поиск пользователя в базе данных
    const user = await User.findOne({ username });
    
    // Если пользователь не найден
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверное имя пользователя или пароль',
        errors: ['Неверное имя пользователя или пароль']
      });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверное имя пользователя или пароль',
        errors: ['Неверное имя пользователя или пароль']
      });
    }

    // Проверка активности пользователя
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Учетная запись отключена',
        errors: ['Учетная запись отключена']
      });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );
    
    return res.json({
      success: true,
      message: 'Успешная авторизация',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role
        }
      }
    });
  } catch (error: any) {
    console.error('Ошибка авторизации:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка авторизации',
      errors: [error.message]
    });
  }
};

// Регистрация пользователя (только для администраторов)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, role, email, phone, hourlyRate } = req.body;

    // Проверка наличия обязательных полей
    if (!username || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать имя пользователя, пароль и полное имя',
        errors: ['Необходимо указать имя пользователя, пароль и полное имя']
      });
    }

    // Проверка, существует ли пользователь с таким именем
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким именем уже существует',
        errors: ['Пользователь с таким именем уже существует']
      });
    }

    // Создание нового пользователя
    const newUser = new User({
      username,
      password,
      fullName,
      role: role || 'worker',
      email,
      phone,
      hourlyRate: hourlyRate || 0,
      active: true
    });

    // Сохранение пользователя в базе данных
    await newUser.save();
    
    return res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      data: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error('Ошибка регистрации:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка регистрации',
      errors: [error.message]
    });
  }
};

// Получение информации о текущем пользователе
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Получение ID пользователя из middleware auth
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован',
        errors: ['Не авторизован']
      });
    }
    
    // Поиск пользователя в базе данных
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        errors: ['Пользователь не найден']
      });
    }
    
    return res.json({
      success: true,
      message: 'Информация о пользователе',
      data: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        hourlyRate: user.hourlyRate
      }
    });
  } catch (error: any) {
    console.error('Ошибка получения информации о пользователе:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка получения информации о пользователе',
      errors: [error.message]
    });
  }
};
