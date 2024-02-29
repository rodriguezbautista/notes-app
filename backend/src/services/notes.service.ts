import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Notes, Prisma, PrismaPromise } from '@prisma/client';

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
			.then(note => ({
				...note,
				categories: note.categories.map(c => c.category),
			}));
	}

	async getNotes(
		notesWhereInput: Prisma.NotesWhereInput,
	): Promise<Notes[] | null> {
		return this.prisma.$queryRaw`
      SELECT n.*, ARRAY_REMOVE(ARRAY_AGG(c.category), NULL) AS categories 
      FROM "Notes" n
      LEFT JOIN "Categories" c ON c."noteId" = n.id
      WHERE "authorId" = ${notesWhereInput.authorId}
      GROUP BY n.id
      ORDER BY n."lastModified" DESC;
      ` as PrismaPromise<Notes[]>;
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
			.then(note => ({
				...note,
				categories: note.categories.map(c => c.category),
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
