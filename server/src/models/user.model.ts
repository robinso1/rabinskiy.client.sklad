// User model

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  password: string;
  fullName: string;
  role: 'admin' | 'worker';
  email?: string;
  phone?: string;
  hourlyRate?: number; // Почасовая ставка для учета времени
  active: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'worker'], default: 'worker' },
  email: { type: String },
  phone: { type: String },
  hourlyRate: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function(next) {
  const user = this as IUser;
  
  // Хешируем пароль только если он был изменен или это новый пользователь
  if (!user.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
