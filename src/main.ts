import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { initializeTransactionalContext } from "typeorm-transactional";
import session = require("express-session");
import * as crypto from "node:crypto";
import * as passport from 'passport';
import * as process from "node:process";

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  }));

  app.use(
      session({
        secret: crypto.randomBytes(32).toString("base64"),
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
      }),
  );

  app.enableCors({ origin: '*', methods: '*', allowedHeaders: '*' });
  app.use(passport.initialize());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
