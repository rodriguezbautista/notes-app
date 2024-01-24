import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ValidationService } from "src/services/validation.service";

@Injectable()
export class ValidationMiddleware implements NestMiddleware{
  constructor(private readonly validationService: ValidationService) {}

  use(request: Request, response: Response, next: NextFunction){
    try{
      const { token, user } = request.cookies;
      this.validationService.validate(token, user)
      next(); 
    } catch(err){
      return response.status(401).json('User is not logged in') 
    }
  }
}