import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const whitelist = process.env.ACCEPTED_DOMAINS.split(";");
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else { 
        callback(new Error('Not allowed by CORS'));
      };
    },
    credentials: true
  };

  app.use(cors(corsOptions));

  dotenv.config();

  await app.listen(8080);
}

bootstrap();
