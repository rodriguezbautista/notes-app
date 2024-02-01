import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller('/logout')
export class LogoutController{
  @Get()
  logout(@Res() response: Response){
    response.appendHeader('Set-Cookie', `token=; httponly; SameSite=None; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    response.appendHeader('Set-Cookie', `user=; httponly; SameSite=None; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    response.send()
  }
}