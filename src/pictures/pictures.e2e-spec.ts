import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PicturesModule } from './pictures.module';
import { HttpStatus } from '@nestjs/common/enums';
import { addDays, formatISO9075 } from 'date-fns';

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
        it('returns 400 on no "from" param', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?from=2023-01-18')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('Both "from" and "to" query params are required.');
        });

        it('returns 400 on no "to" param', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?to=2023-01-19')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('Both "from" and "to" query params are required.');
        });

        it('returns 400 on no params passed', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?to=2023-01-19')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('Both "from" and "to" query params are required.');
        });

        it('returns 400 on invalid "from" date format passed', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?from=15-01-2023&to=2023-01-19')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('Start date has invalid ISO8601 date format.');
        });

        it('returns 400 on invalid "to" date format passed', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?from=2023-01-15&to=19-01-2023')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('End date has invalid ISO8601 date format.');
        });

        it('returns 400 on end date is before start date', async () => {
            const res = await request(app.getHttpServer())
                .get('/pictures?from=2023-01-15&to=2023-01-10')
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('End date is before start date.');
        });

        it('returns 400 on end date is after today\'s date', async () => {
            const dayAfterTomorrow = formatISO9075(addDays(new Date(), 2));

            const res = await request(app.getHttpServer())
                .get(`/pictures?from=2023-01-19&to=${dayAfterTomorrow}`)
                .expect(HttpStatus.BAD_REQUEST)
                .send();

            expect(res.body.message).toBe('End date is after today\'s date.');
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
