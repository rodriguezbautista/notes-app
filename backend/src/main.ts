import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());

	const whitelist = process.env.ACCEPTED_DOMAINS.split(';');

	app.enableCors({
		allowedHeaders: ['content-type'],
		origin: 'http://localhost:3000',
		credentials: true,
	});

	dotenv.config();

	await app.listen(8080);
}

bootstrap();
