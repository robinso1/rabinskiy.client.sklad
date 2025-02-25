import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: Types.ObjectId };
      userId?: Types.ObjectId;
    }
  }
}

// Расширение типов для обработчиков маршрутов Express
declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    [key: string]: string;
  }

  interface Request {
    user?: IUser;
    userId?: string;
    userRole?: string;
  }

  // Переопределение типа для обработчиков маршрутов
  interface IRouterMatcher<T> {
    (path: PathParams, ...handlers: Array<RequestHandler<ParamsDictionary, any, any>>): T;
    <P extends ParamsDictionary>(path: PathParams, ...handlers: Array<RequestHandler<P, any, any>>): T;
    (path: PathParams, ...handlers: Array<RequestHandlerParams>): T;
  }
}

// Тип для преобразования ObjectId в строку
export type ObjectIdToString<T> = {
  [K in keyof T]: T[K] extends Types.ObjectId ? string : T[K] extends Types.ObjectId[] ? string[] : T[K];
};

export {}; 