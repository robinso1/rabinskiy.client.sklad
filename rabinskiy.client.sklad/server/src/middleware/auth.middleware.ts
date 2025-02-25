// Authentication middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Расширяем интерфейс Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
      userRole?: string;
    }
  }
}

// Middleware для проверки аутентификации
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получение токена из заголовка
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string, role: string };
    
    // Добавление данных пользователя в запрос
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

// Middleware для проверки роли администратора
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
  }
  next();
};

// Middleware для получения полных данных пользователя
export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении данных пользователя' });
  }
};
