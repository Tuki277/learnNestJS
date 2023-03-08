import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
// import * as fs from 'fs';
// import * as express from 'express';
// import * as http from 'http';
// import * as https from 'https';
// import io from 'socket.io';

async function bootstrap() {
  // const httpOptions = {
  //   key: fs.readFileSync('././cert/key.pem'),
  //   cert: fs.readFileSync('././cert/cert.pem'),
  // };

  // const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    // new ExpressAdapter(server),
  );

  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Swagger UI')
    .setDescription('The Demo Nest API')
    .setVersion('1.0')
    .addTag('user')
    .addTag('category')
    .addTag('news')
    .addTag('call')
    .addTag('sync')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
  // await app.init();
  // http.createServer(server).listen(3000);
  // https.createServer(httpOptions, server).listen(3001);
}

bootstrap();
