import { IUser } from '../models/user.model';
import { Types } from 'mongoose';

// Расширение типов для Express
declare module 'express' {
  export interface Request {
    user?: IUser & { _id: Types.ObjectId };
    userId?: Types.ObjectId;
    userRole?: string;
  }
}

export {}; 