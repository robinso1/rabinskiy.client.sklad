// User controller

import express from 'express';
import User from '../models/user.model';

// Функция для корректного сравнения идентификаторов (строка или ObjectId)
function compareIds(id1: any, id2: any): boolean {
  return id1.toString() === id2.toString();
}

// Получение списка пользователей
export const getUsers = async (req, res) => {
  try {
    // Параметры запроса
    const role = req.query.role as string;
    const active = req.query.active === 'true';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    
    // Формирование фильтра
    const filter: any = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (req.query.active !== undefined) {
      filter.active = active;
    }
    
    // Получение пользователей из базы данных
    const users = await User.find(filter)
      .select('-password')
      .skip(offset)
      .limit(limit)
      .sort({ fullName: 1 });
    
    // Получение общего количества пользователей
    const total = await User.countDocuments(filter);
    
    return res.json({
      success: true,
      message: 'Список пользователей',
      data: users,
      meta: {
        total,
        limit,
        offset
      }
    });
  } catch (error: any) {
    console.error('Ошибка получения списка пользователей:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка получения списка пользователей',
      errors: [error.message]
    });
  }
};

// Получение пользователя по ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Проверка прав доступа: только администратор или сам пользователь может получать информацию
    if (req.userRole !== 'admin' && !compareIds(req.userId, userId)) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен',
        errors: ['Доступ запрещен']
      });
    }
    
    // Получение пользователя из базы данных
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
      data: user
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

// Обновление пользователя
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, email, phone, hourlyRate, active, role } = req.body;
    
    // Получение пользователя из базы данных
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        errors: ['Пользователь не найден']
      });
    }
    
    // Обновление данных пользователя
    if (fullName) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
    if (active !== undefined) user.active = active;
    if (role) user.role = role;
    
    // Сохранение обновленного пользователя
    await user.save();
    
    return res.json({
      success: true,
      message: 'Пользователь успешно обновлен',
      data: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        hourlyRate: user.hourlyRate,
        active: user.active
      }
    });
  } catch (error: any) {
    console.error('Ошибка обновления пользователя:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления пользователя',
      errors: [error.message]
    });
  }
};

// Изменение пароля пользователя
export const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    
    // Проверка наличия обязательных полей
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать текущий и новый пароль',
        errors: ['Необходимо указать текущий и новый пароль']
      });
    }
    
    // Проверка прав доступа: только администратор или сам пользователь может менять пароль
    if (req.userRole !== 'admin' && !compareIds(req.userId, userId)) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен',
        errors: ['Доступ запрещен']
      });
    }
    
    // Получение пользователя из базы данных
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        errors: ['Пользователь не найден']
      });
    }
    
    // Проверка текущего пароля
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Неверный текущий пароль',
        errors: ['Неверный текущий пароль']
      });
    }
    
    // Обновление пароля
    user.password = newPassword;
    await user.save();
    
    return res.json({
      success: true,
      message: 'Пароль успешно изменен'
    });
  } catch (error: any) {
    console.error('Ошибка изменения пароля:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка изменения пароля',
      errors: [error.message]
    });
  }
};

// Удаление пользователя
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Получение пользователя из базы данных
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        errors: ['Пользователь не найден']
      });
    }
    
    // Удаление пользователя
    await User.findByIdAndDelete(userId);
    
    return res.json({
      success: true,
      message: 'Пользователь успешно удален'
    });
  } catch (error: any) {
    console.error('Ошибка удаления пользователя:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка удаления пользователя',
      errors: [error.message]
    });
  }
}; 