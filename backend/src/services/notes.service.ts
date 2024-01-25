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
      where: notesWhereInput,
      include: {
        categories: {
          select: {
            category: true
          }
        },
      }
    }).then(res => 
      res.map(note => {
        return {...note, categories: note.categories.map(c => c.category)}
      })
        .sort((a, b) => (a.lastModified > b.lastModified)? -1: 1));
  }

  async createNote(
    data: Prisma.NotesCreateInput
  ): Promise<Notes> {
    return this.prisma.notes.create({
      data
    })
  }

  async updateNote(params: {
    where: Prisma.NotesWhereUniqueInput;
    data: Prisma.NotesUpdateInput; 
  }): Promise<Notes> {
    const { where, data } = params;

    return this.prisma.notes.update({
      data,
      where,
    });
  }

  async deleteNote(where: Prisma.NotesWhereUniqueInput): Promise<Notes> {
    await this.prisma.categories.deleteMany({
      where: {
        noteId: where.id
      }
    })
    return this.prisma.notes.delete({
      where,
    });
  }
}