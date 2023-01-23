import { Injectable } from '@nestjs/common';
import { APODClient } from '../nasa/apod/apod.client';
import { eachDayOfInterval, formatISO9075 } from 'date-fns';

@Injectable()
export class PicturesService {
    constructor(private readonly apodClient: APODClient) {
    }

    async fetchNasaAPODPictures(start: string, end: string) {
        return await this.apodClient.fetchForDates(this.getAllDatesBetween(start, end));
    }

    // todo: to rethink - as an external function it'd be easier to test it but for now it's tightly coupled with this service
    private getAllDatesBetween(start: string, end: string): string[] {
        return eachDayOfInterval(
            {
                start: new Date(start),
                end: new Date(end),
            },
        )
            .map((date) => formatISO9075(date, { representation: 'date' }));
    }
}
