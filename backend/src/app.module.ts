import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoginController } from './controllers/login.controller';
import { UserService } from './services/users.service';
import { ValidationController } from './controllers/sessionValidation.controller';
import { PrismaService } from './services/prisma.service';
import { SigninController } from './controllers/signin.contoller';
import { NotesController } from './controllers/notes.controller';
import { NotesService } from './services/notes.service';
import { ValidationService } from './services/validation.service';
import { ValidationMiddleware } from './middlewares/sessionValidation.middleware';
import { LogoutController } from './controllers/logout.controller';
import { CategoriesService } from './services/categories.service';

@Module({
  imports: [],
  controllers: [
    NotesController,
    LoginController,
    SigninController,
    LogoutController,
    ValidationController,
  ],
  providers: [
    PrismaService,
    UserService,
    NotesService,
    ValidationService,
    CategoriesService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidationMiddleware).forRoutes(NotesController);
  }
}
