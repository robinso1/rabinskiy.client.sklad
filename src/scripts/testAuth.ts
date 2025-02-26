// Тестовый скрипт для проверки авторизации

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

// Загрузка переменных окружения
dotenv.config();

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabinskiy-sklad';

async function testAuth() {
  try {
    // Подключение к MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Подключение к MongoDB установлено');

    // Поиск пользователя в базе данных
    const username = 'admin';
    const password = 'password';
    
    const user = await User.findOne({ username });
    
    if (!user) {
      console.error('Пользователь не найден');
      process.exit(1);
    }
    
    console.log('Пользователь найден:', {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      password: user.password
    });
    
    // Проверка пароля
    console.log('Проверка пароля...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Результат проверки пароля:', isPasswordValid);
    
    // Проверка пароля напрямую через bcrypt
    console.log('Проверка пароля напрямую через bcrypt...');
    const isPasswordValidDirect = await bcrypt.compare(password, user.password);
    console.log('Результат прямой проверки пароля:', isPasswordValidDirect);
    
    // Создание нового хеша пароля
    console.log('Создание нового хеша пароля...');
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(password, salt);
    console.log('Новый хеш пароля:', newPasswordHash);
    
    // Проверка нового хеша
    console.log('Проверка нового хеша...');
    const isNewHashValid = await bcrypt.compare(password, newPasswordHash);
    console.log('Результат проверки нового хеша:', isNewHashValid);
    
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при тестировании авторизации:', error);
    process.exit(1);
  }
}

// Запуск тестирования
testAuth(); 