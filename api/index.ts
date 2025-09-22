// api/index.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedServer: any;

async function bootstrapServer() {
  const server = express();

  // Create Nest on top of Express (no app.listen here)
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Mirror any setup you have in src/main.ts:
  app.enableCors({ origin: true, credentials: true });
  // app.setGlobalPrefix('api');            // if you use a global prefix
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();
  return server;
}

// Default export = Vercel serverless function handler
export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(req, res);
}
