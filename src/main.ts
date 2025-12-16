import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionInterceptor } from './shared/exception.interceptor';
import { GlobalResponseInterceptor } from './shared/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 配置静态文件服务 - 在拦截器之前配置，使用 Express 原生中间件绕过拦截器
  app.use('/file', express.static(join(process.cwd(), 'upload', 'file')));
  
  app.useGlobalInterceptors(new GlobalExceptionInterceptor());
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
    exposedHeaders: ['Content-Length','X-Response-Time'],
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();