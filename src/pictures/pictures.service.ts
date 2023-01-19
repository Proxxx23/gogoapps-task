import { Injectable } from '@nestjs/common'
import { ApodService } from '../nasa/apod/apod.service'
import { eachDayOfInterval, formatISO9075 } from 'date-fns'

@Injectable()
export class PicturesService {
    constructor(private readonly apodService: ApodService) {
    }

    async fetchNasaAPODPictures(start: string, end: string): Promise<string[]> {
        const responseData = await this.apodService.fetchForDates(this.getAllDatesBetween(start, end));

        return responseData.map((data) => data.url);
    }

    // todo: to rethink - as an external function it'd be easier to test it but for now it's tightly coupled with this service
    private getAllDatesBetween(start: string, end: string): string[] {
        return eachDayOfInterval(
            {
                start: new Date(start),
                end: new Date(end),
            }
        )
            .map((date) => formatISO9075(date, { representation: 'date' }));
    }
}
