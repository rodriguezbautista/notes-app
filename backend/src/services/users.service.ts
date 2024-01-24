import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Users, Prisma } from '@prisma/client';

@Injectable()
export class UserService{
  constructor(private prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput
  ): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: userWhereUniqueInput
    })
  }

  async createUser(
    data: Prisma.UsersCreateInput
  ): Promise<Users> {
    return this.prisma.users.create({
      data
    })
  }

  async updateUser(params: {
    where: Prisma.UsersWhereUniqueInput;
    data: Prisma.UsersUpdateInput;
  }): Promise<Users> {
    const { where, data } = params;
    return this.prisma.users.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UsersWhereUniqueInput): Promise<Users> {
    return this.prisma.users.delete({
      where,
    });
  }
}