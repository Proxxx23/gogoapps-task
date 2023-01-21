import { Module } from '@nestjs/common';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';
import { ApodClient } from '../nasa/apod/apod.client';

@Module({
    imports: [],
    controllers: [PicturesController],
    providers: [PicturesService, ApodClient],
})
export class PicturesModule {}
