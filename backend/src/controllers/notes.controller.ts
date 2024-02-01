import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { Response, Request } from 'express'
import { Prisma } from '@prisma/client';
import { CategoriesService } from 'src/services/categories.service';

@Controller('/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService, private readonly categoriesService: CategoriesService) {}

  @Get()
  async userNotes(@Req() request: Request, @Res() response: Response): Promise<Response | null> {
    try{
      const user = request.cookies.user;
      const notes = await this.notesService.getNotes({ authorId: user });
      
      if(notes){
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
      const note = await this.notesService.createNote(body);

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
  async edit(@Body() body: Prisma.NotesUpdateInput | any, @Param('id') id: string, @Res() response: Response): Promise<Response | null>{
    try{
      

      /* Cannot make the following code because clientside categories doesn't have an id and therefore cannot be compared to db categories
        notesService.update({
          categories: {
            upsert: {
              ...
            }
          }
        }) 
      */
     

      /* let newCategories 
      if (categories){
        const currentCategories = await this.categoriesService.getCategories({
          where: {
            noteId: Number(id)
          }
        });

        newCategories = categories.filter(c => !currentCategories.some(curr => curr.category === c.category));
  
        const erasedCategories = currentCategories.filter(c => !categories.some(curr => curr.category === c.category));
        
        erasedCategories.forEach(async category => {
          await this.categoriesService.deleteCategory({
              id: category.id
            })
        });
      } */



      const post = await this.notesService.updateNote({
        data: {
          content: body.content,
          status: body.status,
          categories: {
            create: body.categories?.map(c => {return { "category": c.category }})
          }
        },
        where: {
          id: Number(id)
        },
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
      await this.notesService.deleteNote({
        id: Number(id)
      })
      return response.status(204).send()
    } catch(err) {
      console.log(err);
      return response.status(500).json(err)
    }
  }
}