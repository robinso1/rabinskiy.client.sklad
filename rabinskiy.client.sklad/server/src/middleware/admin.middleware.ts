import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для проверки, является ли пользователь администратором
 */
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      errors: ['Unauthorized']
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      errors: ['Access denied. Admin role required']
    });
  }

  next();
}; 