import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Notes, Prisma } from '@prisma/client';

@Injectable()
export class NotesService{
  constructor(private prisma: PrismaService) {}

  async getNote(
    notesWhereUniqueInput: Prisma.NotesWhereUniqueInput
  ): Promise<Notes | null> {
    return this.prisma.notes.findUnique({
      where: notesWhereUniqueInput
    })
  }
  
  async getNotes(
    notesWhereInput: Prisma.NotesWhereInput
  ): Promise<Notes[] | null> {
    return this.prisma.notes.findMany({
      include: {
        user: true
      },
      where: notesWhereInput
    })
  }

  async createNotes(
    data: Prisma.NotesCreateInput
  ): Promise<Notes> {
    return this.prisma.notes.create({
      data
    })
  }

  async updateNotes(params: {
    where: Prisma.NotesWhereUniqueInput;
    data: Prisma.NotesUpdateInput;
  }): Promise<Notes> {
    const { where, data } = params;
    return this.prisma.notes.update({
      data,
      where,
    });
  }

  async deleteNotes(where: Prisma.NotesWhereUniqueInput): Promise<Notes> {
    return this.prisma.notes.delete({
      where,
    });
  }
}