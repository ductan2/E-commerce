import { Request } from 'express'; // Đảm bảo rằng bạn đã import đúng kiểu Request
import User from './models/schemas/users.schemas';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    user?: User 
  }
}