import { Module } from '@nestjs/common';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';
import { APODClient } from '../nasa/apod/apod.client';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PicturesThrottlerGuard } from '../throttler/PicturesThrottlerGuard';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
        }),
        ThrottlerModule.forRoot({
            ttl: 6,
            limit: 1,
        }),
    ],
    controllers: [PicturesController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: PicturesThrottlerGuard,
        },
        PicturesService,
        APODClient,
    ],
})
export class PicturesModule {}
