import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://example.com',
    ],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(4000,()=>console.log("Server is running at port: 4000"));
}
bootstrap();
