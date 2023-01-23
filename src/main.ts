import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import process from 'process';
import * as dotenv from 'dotenv';

const DEFAULT_PORT = 8080;

async function bootstrap() {
    // should lay in test config
    if (process.env.NODE_ENV === 'test') {
        process.env.API_KEY = process.env.TEST_API_KEY;
    }

    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Url-collector API')
        .setDescription('Url-collector API documentation.')
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);

    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false,
        }),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            forbidUnknownValues: true,
            transform: true,
            whitelist: true,
        }),
    );

    // Custom port exposing does not work
    const env = dotenv.config().parsed;
    const port = process.env.PORT || env.PORT || DEFAULT_PORT;
    await app.listen(port);

    console.log(`Server running at port ${port}`);
}

bootstrap();
