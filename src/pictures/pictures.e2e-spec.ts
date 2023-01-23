import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PicturesModule } from './pictures.module';
import { HttpStatus } from '@nestjs/common/enums';
import { addDays, formatISO9075, subDays } from 'date-fns'
import { MAX_PARALLEL_REQUESTS } from '../nasa/apod/apod.client'

describe('Pictures endpoints', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [PicturesModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    describe('[GET] /pictures', () => {
        it('returns 400 BAD REQUEST on no query params specified', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('Both "from" and "to" query params are required.');
        });

        it('returns 400 BAD REQUEST on no "from" query param specified', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?from=2023-01-18')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('Both "from" and "to" query params are required.');
        });

        it('returns 400 BAD REQUEST on no "to" query param specified', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?to=2023-01-19')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('Both "from" and "to" query params are required.');
        });

        it('returns 400 BAD REQUEST on invalid "from" query param date format passed', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?from=15-01-2023&to=2023-01-19')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('Start date has invalid ISO8601 date format.');
        });

        it('returns 400 BAD REQUEST on invalid "to" query param date format passed', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?from=2023-01-15&to=19-01-2023')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('End date has invalid ISO8601 date format.');
        });

        it('returns 400 BAD REQUEST on end date is before start date', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?from=2023-01-15&to=2023-01-10')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('End date is before start date.');
        });

        it('returns 400 BAD REQUEST on end date is after today\'s date', async () => {
            const dayAfterTomorrow = formatISO9075(addDays(new Date(), 2), { representation: 'date' });

            const res = await request(app.getHttpServer())
                .get(`/pictures?from=2023-01-19&to=${dayAfterTomorrow}`)
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('End date is after today\'s date.');
        });

        // it('returns 200 OK with array of urls upon valid request for two dates interval', async () => {
        //     const yesterday = formatISO9075(subDays(new Date(), 1));
        //     const today = formatISO9075(new Date());
        //
        //     const res = await request(app.getHttpServer())
        //         .get(`/pictures?from=${yesterday}&to=${today}`)
        //         .expect(HttpStatus.OK)
        //         .send();
        //
        //     expect(res.body).not.toBeUndefined();
        //     expect(res.body.urls).toHaveLength(2);
        //     expect(res.body.urls[0]).not.toBeUndefined();
        //     expect(res.body.urls[1]).not.toBeUndefined();
        // });

        it('returns 200 OK with array of urls upon valid request for more than MAX_CONCURRENT_REQUESTS dates interval', async () => {
            const fewDaysAgo = formatISO9075(subDays(new Date(), MAX_PARALLEL_REQUESTS + 2), { representation: 'date' });
            const today = formatISO9075(new Date(), { representation: 'date' });

            console.log(fewDaysAgo, today);

            const res = await request(app.getHttpServer())
                .get(`/pictures?from=${fewDaysAgo}&to=${today}`)
                .expect(HttpStatus.OK)
                .send();

            expect(res.body).not.toBeUndefined();
            expect(res.body.urls).toHaveLength(MAX_PARALLEL_REQUESTS + 2);
            expect(res.body.urls[0]).not.toBeUndefined();
            expect(res.body.urls[1]).not.toBeUndefined();
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
