import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { initializeTransactionalContext } from "typeorm-transactional";
import session = require("express-session");

import * as passport from 'passport';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  }));

  app.use(
      session({
        secret: 'your-secret', // change to a secure secret in production
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
      }),
  );

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
