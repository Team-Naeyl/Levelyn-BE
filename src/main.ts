import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { initializeTransactionalContext } from "typeorm-transactional";
import * as passport from 'passport';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  }));

  app.use(passport.initialize());

  SwaggerModule.setup(
      "api-docs", app,
      SwaggerModule.createDocument(
          app,
          new DocumentBuilder()
              .setTitle('Levelyn API Docs')
              .setVersion('1.0.0')
              .build()
      )
  );

  await app.listen(3000, "0.0.0.0");
}


bootstrap();
