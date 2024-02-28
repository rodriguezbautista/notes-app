import { Controller, Req, Res, Get } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { Request, Response } from 'express';
import { ValidationService } from 'src/services/validation.service';

@Controller('/sessionValidation')
export class ValidationController {
  constructor(
    private readonly userService: UserService,
    private readonly validationService: ValidationService,
  ) {}

  @Get()
  async validateAuth(
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<Response | null> {
    try {
      const { token, user } = request.cookies;
      const validatedUser = this.validationService.validate(token, user);
      return response.status(200).json(validatedUser);
    } catch (err) {
      return response.status(401).json('User not logged in');
    }
  }
}
