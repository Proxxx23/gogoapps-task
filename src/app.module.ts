import { Module } from '@nestjs/common';
import { PicturesModule } from './pictures/pictures.module';

@Module({
    imports: [PicturesModule],
    controllers: [],
    providers: [],
})
export class AppModule {
}
