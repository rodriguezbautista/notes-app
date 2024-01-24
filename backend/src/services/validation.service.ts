import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ValidationService{
  validate(token: string | null, user: string | null){
    if (!token || !user){
      throw new Error('User not logged in')
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded !== user){
      throw new Error('Unauthorized user');
    }
    
    return user;
  }
}