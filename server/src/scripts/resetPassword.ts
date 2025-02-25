import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

// Загрузка переменных окружения
dotenv.config();

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabinskiy-sklad';

async function resetPassword() {
  try {
    // Подключение к MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Подключение к MongoDB установлено');

    // Поиск пользователя в базе данных
    const username = 'admin';
    const newPassword = 'password';
    
    const user = await User.findOne({ username });
    
    if (!user) {
      console.error('Пользователь не найден');
      process.exit(1);
    }
    
    console.log('Пользователь найден:', {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      role: user.role
    });
    
    // Создание нового хеша пароля
    console.log('Создание нового хеша пароля...');
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
    // Обновление пароля пользователя напрямую в базе данных
    console.log('Обновление пароля напрямую в базе данных...');
    await User.updateOne({ _id: user._id }, { $set: { password: newPasswordHash } });
    
    console.log('Пароль пользователя успешно обновлен');
    
    // Получение обновленного пользователя
    const updatedUser = await User.findOne({ username });
    
    if (!updatedUser) {
      console.error('Не удалось получить обновленного пользователя');
      process.exit(1);
    }
    
    // Проверка нового пароля
    console.log('Проверка нового пароля...');
    const isPasswordValid = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('Результат проверки нового пароля:', isPasswordValid);
    
    // Обновление пароля для worker1
    const worker = await User.findOne({ username: 'worker1' });
    
    if (worker) {
      console.log('Пользователь worker1 найден, обновляем пароль...');
      await User.updateOne({ _id: worker._id }, { $set: { password: newPasswordHash } });
      console.log('Пароль пользователя worker1 успешно обновлен');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    process.exit(1);
  }
}

// Запуск сброса пароля
resetPassword(); 