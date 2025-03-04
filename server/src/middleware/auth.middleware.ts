// Auth middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширение интерфейса Request для добавления userId и userRole
declare global {
  namespace Express {
    interface Request {
      userId: string;
      userRole: string;
    }
  }
}

// Middleware для проверки авторизации
export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получение токена из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован',
        errors: ['Отсутствует токен авторизации']
      });
    }
    
    // Извлечение токена из заголовка
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован',
        errors: ['Отсутствует токен авторизации']
      });
    }
    
    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
    
    // Добавление userId и userRole в объект запроса
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    next();
  } catch (error: any) {
    console.error('Ошибка авторизации:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован',
        errors: ['Срок действия токена истек']
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Не авторизован',
      errors: ['Недействительный токен авторизации']
    });
  }
};

// Middleware для проверки прав администратора
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Доступ запрещен',
      errors: ['Требуются права администратора']
    });
  }
  
  next();
};

// Middleware для проверки прав работника или администратора
export const workerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'worker' && req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Доступ запрещен',
      errors: ['Требуются права работника или администратора']
    });
  }
  
  next();
};
