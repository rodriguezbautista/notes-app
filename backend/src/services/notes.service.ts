import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Notes, Prisma } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async getNote(
    notesWhereUniqueInput: Prisma.NotesWhereUniqueInput,
  ): Promise<Notes | null> {
    return this.prisma.notes
      .findUnique({
        where: notesWhereUniqueInput,
        include: {
          categories: {
            select: {
              category: true,
            },
          },
        },
      })
      .then((note) => ({
        ...note,
        categories: note.categories.map((c) => c.category),
      }));
  }

  async getNotes(
    notesWhereInput: Prisma.NotesWhereInput,
  ): Promise<Notes[] | null> {
    return this.prisma.notes
      .findMany({
        where: notesWhereInput,
        orderBy: {
          lastModified: 'desc',
        },
        include: {
          categories: {
            select: {
              category: true,
            },
          },
        },
      })
      .then((notes) =>
        notes.map((note) => ({
          ...note,
          categories: note.categories.map((c) => c.category),
        })),
      );
  }

  async createNote(data: Prisma.NotesCreateInput): Promise<Notes> {
    return this.prisma.notes.create({
      data,
    });
  }

  async updateNote(params: {
    where: Prisma.NotesWhereUniqueInput;
    data: Prisma.NotesUpdateInput;
  }): Promise<Notes> {
    const { where, data } = params;

    return this.prisma.notes
      .update({
        data,
        where,
        include: {
          categories: {
            select: {
              category: true,
            },
          },
        },
      })
      .then((note) => ({
        ...note,
        categories: note.categories.map((c) => c.category),
      }));
  }

  async deleteNote(where: Prisma.NotesWhereUniqueInput | any): Promise<Notes> {
    await this.prisma.categories.deleteMany({
      where: {
        noteId: where.id,
      },
    });
    return this.prisma.notes.delete({
      where,
    });
  }
}
