import { ApiBadGatewayResponse, ApiBadRequestResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { PicturesService } from './pictures.service';
import { DateValidationPipe } from './validation/DateValidationPipe';

type FetchUrlsResponse = {
    urls: string[]
};

type DateRangeQueryParams = {
    from: string,
    to: string,
};

@ApiTags('pictures')
@Controller('/pictures')
export class PicturesController {
    constructor(private readonly picturesService: PicturesService) {}

    @Get()
    @ApiQuery({ name: 'from', type: 'string' })
    @ApiQuery({ name: 'to', type: 'string' })
    @ApiOkResponse(
        {
            schema: {
                properties: {
                    urls: {
                        type: 'string',
                    },
                },
            },
            status: HttpStatus.OK,
        },
    )
    @ApiBadRequestResponse({
        description: 'Dates validation problem: empty, invalid format or another irregularity',
    })
    @ApiBadGatewayResponse({
        description: 'Could not obtain data from NASA APOD API',
    })
    @HttpCode(HttpStatus.OK)
    async index(@Query(DateValidationPipe) date: DateRangeQueryParams): Promise<FetchUrlsResponse | never> {
        const pictures = await this.picturesService.fetchNasaAPODPictures(date.from, date.to);

        return {
            urls: pictures.map((picture) => picture.url),
        };
    }
}
