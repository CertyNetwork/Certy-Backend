import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { urlencoded, json } from 'express';
import session from 'express-session';
import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import firebaseConfig from './config/firebase.config';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const allowCors = [
    'https://certify-liard.vercel.app',
    'https://certy.network',
    'http://localhost:4200',
  ];
  app.enableCors((req, cb) => {
    const options = {
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    };
    if (allowCors.indexOf(req.header('Origin')) !== -1) {
      options.origin = true;
      options.credentials = true;
    }
    return cb(null, options);
  });

  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(json({limit: '50mb'}));
  app.use(urlencoded({limit: '50mb', extended: true}));
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'certy-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  // Firebase setup
  const adminConfig: ServiceAccount = firebaseConfig;
  adminConfig.privateKey = adminConfig.privateKey.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    storageBucket: "certify-502fb.appspot.com",
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Certy')
    .setDescription('Certy API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT');
  await app.listen(port || 3000);

  // Setting ErrorHandler
}
bootstrap();
