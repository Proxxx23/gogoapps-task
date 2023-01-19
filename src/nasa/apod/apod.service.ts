import { firstValueFrom } from 'rxjs';
import { HttpStatus } from '@nestjs/common/enums';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import process from 'process';

const apiUrl = (date: string) => `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY ?? 'DEMO_KEY'}&date=${date}`;

export type NasaAPODResponse = {
    copyright: string,
    date: string,
    explanation: string,
    hdurl: string,
    media_type: string,
    service_version: string,
    title: string,
    url: string,
}

// todo: that's a client, not a full service. May be moved to it's own lib (taking advantage of NestJS DI right now)
@Injectable()
export class ApodService {
    constructor(private readonly httpClient: HttpService) {}

    async fetchForDates(dates: string[]): Promise<NasaAPODResponse[]> {
        const responses = await Promise.all(dates.map(async (date) => {
            const res = await firstValueFrom(this.httpClient.get<NasaAPODResponse>(apiUrl(date)));
            if (res.status !== HttpStatus.OK) {
                throw new BadGatewayException('Could not retrieve data from NASA APOD API.');
            }

            return res;
        }));

        return responses.map((res) => res.data);
    }
}
