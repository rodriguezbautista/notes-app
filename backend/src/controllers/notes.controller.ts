import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { Response, Request } from 'express'
import { Prisma } from '@prisma/client';

@Controller('/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async userNotes(@Req() request: Request, @Res() response: Response): Promise<Response | null> {
    try{
      const user = request.cookies.user;
      const notes = await this.notesService.getNotes({ authorId: user });
      
      if(notes){
        notes.sort((a, b) => (a.lastModified > b.lastModified)? -1: 1)
        return response.json(notes);
      }
 
      return response.status(401).json('Wrong credentials');
    } catch(err){
      console.log(err);
      return response.status(500).json(err);
    } 
  }
  
  @Post()
  async postNote(@Req() request: Request, @Body() body: Prisma.NotesCreateInput, @Res() response: Response): Promise<Response | null>{
    try{
      body['authorId'] = request.cookies.user
      const note = await this.notesService.createNotes(body);

      if(note){
        return response.status(201).json(note)
      }
  
      return response.status(401).json('Wrong credentials');

    } catch(err){
      console.log(err);
      return response.status(500).json(err)
    } 
  }
  
  @Patch('/:id')
  async edit(@Body() body: Prisma.NotesUpdateInput, @Param('id') id: string, @Res() response: Response): Promise<Response | null>{
    try{
      const { content, isArchived, categories } = body

      const post = await this.notesService.updateNotes({
        where: {
          id: Number(id)
        },
        data: {
          content,
          isArchived,
          categories
        }
      });

      return response.json(post)

    } catch(err){
      console.log(err);
      return response.status(500).json(err)
    }
  }
  
  @Delete('/:id')
  async delete(@Param('id') id: string, @Res() response: Response): Promise<Response | null>{
    try{
      await this.notesService.deleteNotes({
        id: Number(id)
      })
      return response.status(204).send()
    } catch(err) {
      console.log(err);
      return response.status(500).json(err)
    }
  }
} 