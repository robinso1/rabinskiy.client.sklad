import { IUser } from '../models/user.model';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: Types.ObjectId;
      userRole?: string;
    }
  }
}

export {}; 