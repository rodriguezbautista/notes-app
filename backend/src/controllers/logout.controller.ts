import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller('/logout')
export class LogoutController{
  @Get()
  logout(@Res() response: Response){
    response.clearCookie('token');
    response.clearCookie('user');
    response.send()
  }
}