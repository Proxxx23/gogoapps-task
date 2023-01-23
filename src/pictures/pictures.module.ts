import { Module } from '@nestjs/common';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';
import { APODClient } from '../nasa/apod/apod.client';
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [HttpModule.register({
        timeout: 5000,
    })],
    controllers: [PicturesController],
    providers: [PicturesService, APODClient],
})
export class PicturesModule {}
