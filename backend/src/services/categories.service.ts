import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Categories, Prisma } from "@prisma/client";

@Injectable()
export class CategoriesService{
  constructor(private prisma: PrismaService) {}

  async getCategories(params: {
    where: Prisma.CategoriesWhereInput;
  }): Promise<Categories[] | null>{
    const { where } = params

    return this.prisma.categories.findMany({
      include: {
        note: true
      },
      where
    })
  }

  async createCategory(
    data: Prisma.CategoriesCreateInput
  ): Promise<Categories> {
    return this.prisma.categories.create({
      data
    })
  }

  async deleteCategory(where: {id: number}): Promise<Categories> {
    return this.prisma.categories.delete({
      where,
    });
  }

  async deleteCategories(where: Prisma.CategoriesWhereInput){
    return this.prisma.categories.deleteMany({
      where,
    });
  }
}