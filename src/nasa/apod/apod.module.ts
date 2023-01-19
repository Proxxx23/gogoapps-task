import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApodService } from './apod.service';

@Module({
    imports: [
        HttpModule.register(
            {
                timeout: 10000,
            }
        )
    ],
    providers: [ApodService],
    exports: [ApodService],
})
export class ApodModule {}
