import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import process from 'process';
import axios, { isAxiosError } from 'axios'; // NestJS httpClient.axiosRef has no all() method
import chunk from 'lodash.chunk';

const API_KEY = process.env.API_KEY || 'DEMO_KEY';
export const MAX_CONCURRENT_REQUESTS = process.env.CONCURRENT_REQUESTS ? +process.env.CONCURRENT_REQUESTS : 5;

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

// todo: DI axios instance from custom factory provider in module
@Injectable()
export class ApodClient {
    async fetchForDates(dates: string[]): Promise<NasaAPODResponse[]> {
        const endpoints = dates.map((date) => createEndpointUrl(date));

        const responses = dates.length > MAX_CONCURRENT_REQUESTS
            ? await this.fetchInBatches(endpoints)
            : await this.fetch(endpoints);

        return responses.map((res) => res.data);
    }

    private async fetch(endpoints: string[]) {
        return axios.all(endpoints.map(async (endpoint) => {
            try {
                return await axios.get<NasaAPODResponse>(endpoint);
            } catch (err) {
                if (isAxiosError(err)) {
                    throw new BadGatewayException(`NASA APOD API responded with status "${err.status}"`, err.message);
                }
                throw new InternalServerErrorException('[NASA APO API] Internal Server Error', err);
            }
        }));
    }

    private async fetchInBatches(endpoints: string[]) {
        const endpointChunks: string[][] = chunk(endpoints, MAX_CONCURRENT_REQUESTS);

        return Promise.all(endpointChunks.map(async (urls) => await this.fetch(urls)));
    }
}
