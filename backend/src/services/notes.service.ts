import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Categories, Notes, Prisma, PrismaPromise } from '@prisma/client';

export type NotesWithCategories = Notes & { categories: string[] };

@Injectable()
export class NotesService {
	constructor(private prisma: PrismaService) {}

	async getNote(
		notesWhereUniqueInput: Prisma.NotesWhereUniqueInput,
	): Promise<NotesWithCategories | null> {
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
			})) as PrismaPromise<NotesWithCategories>;
	}

	async getNotes(
		notesWhereInput: Prisma.NotesWhereInput,
	): Promise<(Notes & Categories[])[]> {
		return this.prisma.$queryRaw`
      SELECT n.*, ARRAY_REMOVE(ARRAY_AGG(c.category), NULL) AS categories 
      FROM "Notes" n
      LEFT JOIN "Categories" c ON c."noteId" = n.id
      WHERE "authorId" = ${notesWhereInput.authorId}
      GROUP BY n.id
      ORDER BY n."lastModified" DESC;
      ` as PrismaPromise<(Notes & Categories[])[]>;
	}

	async createNote(data: NotesWithCategories): Promise<Notes> {
		return await this.prisma.notes.create({
			data: {
				id: data.id,
				authorId: data.authorId,
				content: data.content,
				categories: {
					create: data.categories.map(c => ({ category: c })),
				},
			},
		});
	}

	async updateNote(params: {
		where: Prisma.NotesWhereUniqueInput;
		data: NotesWithCategories;
	}): Promise<number> {
		const { where, data } = params;

		if (data.categories) {
			await this.prisma.$executeRaw`
					DELETE FROM "Categories"
						WHERE "noteId" = ${where.id}
					`;

			await this.prisma.$executeRaw`
					INSERT INTO "Categories"
					VALUES ${Prisma.join(
						data.categories.map(
							category => Prisma.sql`(${category}, ${where.id})`,
						),
					)}
					`;
		}

		if (data.content) {
			await this.prisma.$executeRaw`
			UPDATE "Notes"
			SET content = ${data.content}, "lastModified" = NOW()
			WHERE id = ${where.id}
			`;
			// await this.prisma.notes.update({
			// 	where: {
			// 		id: where.id,
			// 	},
			// 	data: {
			// 		content: data.content,
			// 	},
			// });
		}

		return 1;
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
