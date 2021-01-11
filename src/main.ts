import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  // unless defined NODE_ENV uses development
  const serverConfig = config.get('server');

  // instantiating logger
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if(process.env.NODE_ENV === 'development' ){
    app.enableCors();
  }else{
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  }
  
  
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);

  //using logger
  logger.log(`Application listening on port: ${port}`)
}
bootstrap();
