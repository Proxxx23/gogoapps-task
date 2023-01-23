import { ApiBadGatewayResponse, ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { PicturesService } from './pictures.service';
import { DateValidationPipe } from './validation/DateValidationPipe';

type IndexResponse = {
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
    @ApiOperation({ summary: 'Endpoint to fetch pictures of the day from NASA APOD API' })
    @ApiQuery({ name: 'from', description: 'Starting date to search images. ISO8601 format.', type: 'string' })
    @ApiQuery({ name: 'to', description: 'Ending date to search images. ISO8601 format', type: 'string' })
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
    async index(@Query(DateValidationPipe) date: DateRangeQueryParams): Promise<IndexResponse | never> {
        const pictures = await this.picturesService.fetchNasaAPODPictures(date.from, date.to);

        return {
            urls: pictures.map((picture) => picture.url),
        };
    }
}
