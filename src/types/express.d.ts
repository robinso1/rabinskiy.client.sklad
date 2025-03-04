import { IUser } from '../models/user.model';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: any;
      userRole?: string;
    }
  }
}

export {}; 