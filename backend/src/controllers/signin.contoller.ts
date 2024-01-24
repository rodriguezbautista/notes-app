import { Controller, Req, Res, Post } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { Request, Response } from 'express'

@Controller('/signin')
export class SigninController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signin(@Res() response: Response, @Req() request: Request): Promise<Response | null> {
    try{
      const { username, email, password } = request.body
      await this.userService.createUser({ username, email, password})

      return response.status(201).json(username);
    } catch(err){
      return response.status(409).json(`${err.meta.target[0]} is already taken`)
    }
  }
}
