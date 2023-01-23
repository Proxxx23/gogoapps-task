import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import process from 'process';
import chunk from 'lodash.chunk';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { isAxiosError } from 'axios';

const API_KEY = process.env.API_KEY || 'DEMO_KEY';
export const MAX_PARALLEL_REQUESTS = process.env.CONCURRENT_REQUESTS ? +process.env.CONCURRENT_REQUESTS : 1;

const createEndpointUrl = (date: string) => `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;

export type NasaAPODResponse = {
    copyright: string,
    date: string,
    explanation: string,
    hdurl: string,
    media_type: string,
    service_version: string,
    title: string,
    url: string,
};

@Injectable()
export class APODClient {
    constructor(private readonly httpClient: HttpService) {}

    async fetchForDates(dates: string[]): Promise<NasaAPODResponse[]> {
        const endpoints = dates.map((date) => createEndpointUrl(date));

        const responses = endpoints.length > MAX_PARALLEL_REQUESTS
            ? await this.fetchInBatches(endpoints)
            : await this.fetch(endpoints);

        return responses.map((res) => res[0]);
    }

    private async fetch(endpoints: string[]) {
        return Promise.all(endpoints.map(async (endpoint) => {
            try {
                const { data } = await firstValueFrom(this.httpClient.get<NasaAPODResponse>(endpoint));

                return data;
            } catch (err) {
                // A bottleneck/rate limiter/requests limiter exclusively for this client will be needed
                if (isAxiosError(err)) {
                    throw new BadGatewayException({
                        error: `[NASA APO API] responded with status ${err.response.status} and message: ${err.response.data.error.message}.`,
                    });
                }

                throw new InternalServerErrorException({ error: 'Internal Server Error' }, err);
            }
        }));
    }

    private async fetchInBatches(endpoints: string[]) {
        const endpointChunks: string[][] = chunk(endpoints, MAX_PARALLEL_REQUESTS);

        return Promise.all(endpointChunks.map(async (urls) => await this.fetch(urls)));
    }
}
