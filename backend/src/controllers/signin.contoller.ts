import { Controller, Req, Res, Post } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken';

@Controller('/signin')
export class SigninController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signin(@Res() response: Response, @Req() request: Request): Promise<Response | null> {
    try{
      const { username, email, password } = request.body
      await this.userService.createUser({ username, email, password})
      
      const token = jwt.sign(username, process.env.JWT_SECRET, {})

      response.appendHeader('Set-Cookie', `token=${token}; httponly; SameSite=None; Secure`)
      response.appendHeader('Set-Cookie', `user=${username}; httponly; SameSite=None; Secure`)

      return response.status(201).send(username);
    } catch(err){
      return response.status(409).json(`${err.meta.target[0]} is already taken`)
    }
  }
}
