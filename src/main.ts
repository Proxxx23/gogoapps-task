import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
        .setTitle('Url-collector API')
        .setDescription('Url-collector API documentation')
        .setVersion('1.0.0')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('doc', app, document)

    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false,
        }),
    )

    app.useGlobalPipes(
        new ValidationPipe({
            forbidUnknownValues: false,
            transform: true,
            whitelist: true,
        }),
    )

    await app.listen(3000)
}

bootstrap()
