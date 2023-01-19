import { Module } from '@nestjs/common'
import { PicturesController } from './pictures.controller'
import { PicturesService } from './pictures.service'
import { ApodModule } from '../nasa/apod/apod.module'

@Module({
    imports: [ApodModule],
    controllers: [PicturesController],
    providers: [PicturesService],
})
export class PicturesModule {}
