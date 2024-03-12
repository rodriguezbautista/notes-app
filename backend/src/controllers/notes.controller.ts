import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { NotesService, NotesWithCategories } from '../services/notes.service';
import { Response, Request } from 'express';

@Controller('/notes')
export class NotesController {
	constructor(private readonly notesService: NotesService) {}

	@Get()
	async getUserNotes(
		@Req() request: Request,
		@Res() response: Response,
	): Promise<Response | null> {
		try {
			const user = request.cookies.user;
			const notes = await this.notesService.getNotes({ authorId: user });

			if (notes) {
				return response.json(notes);
			}

			return response.status(401).json('Wrong credentials');
		} catch (err) {
			console.log(err);
			return response.status(500).json(err);
		}
	}

	@Get('/:id')
	async getUserNoteById(
		@Req() request: Request,
		@Param('id') id: string,
		@Res() response: Response,
	): Promise<Response | null> {
		try {
			const user = request.cookies.user;
			const notes = await this.notesService.getNote({
				authorId: user,
				id: Number(id),
			});

			if (notes) {
				return response.json(notes);
			}

			return response.status(401).json('Wrong credentials');
		} catch (err) {
			console.log(err);
			return response.status(500).json(err);
		}
	}

	@Post()
	async post(
		@Req() request: Request,
		@Body() body: NotesWithCategories,
		@Res() response: Response,
	): Promise<Response | null> {
		try {
			body['authorId'] = request.cookies.user;
			const note = await this.notesService.createNote(body);

			if (note) {
				return response.status(201).json(note);
			}

			return response.status(401).json('Wrong credentials');
		} catch (err) {
			console.log(err);
			return response.status(500).json(err);
		}
	}

	@Patch('/:id')
	async edit(
		@Req() request: Request,
		@Body() body: NotesWithCategories,
		@Param('id') id: string,
		@Res() response: Response,
	): Promise<Response | null> {
		try {
			const authorId = request.cookies.user;
			const post = await this.notesService.updateNote({
				where: { id: Number(id), authorId },
				data: body,
			});

			return response.json(post);
		} catch (err) {
			console.log(err);
			return response.status(500).json(err);
		}
	}

	@Delete('/:id')
	async delete(
		@Param('id') id: string,
		@Res() response: Response,
	): Promise<Response | null> {
		try {
			await this.notesService.deleteNote({
				id: Number(id),
			});
			return response.status(204).send();
		} catch (err) {
			console.log(err);
			return response.status(500).json(err);
		}
	}
}
