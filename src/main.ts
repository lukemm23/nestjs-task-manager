import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common';

async function bootstrap() {
  // instantiating logger
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  await app.listen(port);

  //using logger
  logger.log(`Application listening on port: ${port}`)
}
bootstrap();
