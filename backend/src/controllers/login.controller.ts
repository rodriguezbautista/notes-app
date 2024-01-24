import { Controller, Req, Res, Post } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

@Controller('/login')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async login(@Res() response: Response, @Req() request: Request): Promise<Response | null> {
    try{
      
      const { username, password } = request.body
      
      const user = await this.userService.getUser({ username })

      if (user && password == user.password){
        const token = jwt.sign(username, process.env.JWT_SECRET, {})
        response.appendHeader('Set-Cookie', `token=${token}; httponly`)
        response.appendHeader('Set-Cookie', `user=${username}; httponly`)
        return response.send(user);
      }

      return response.status(401).json('Wrong credentials' );
    } catch(err){
      console.log(err);
      return response.status(500).json(err)
    }
  }
}
