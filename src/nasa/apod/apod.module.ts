import { Module } from '@nestjs/common';
import { ApodService } from './apod.service';

@Module({
    imports: [],
    providers: [ApodService],
    exports: [ApodService],
})
export class ApodModule {}
