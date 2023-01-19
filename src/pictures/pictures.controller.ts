import { ApiBadGatewayResponse, ApiBadRequestResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'
import { HttpCode } from '@nestjs/common/decorators'
import { HttpStatus } from '@nestjs/common/enums'
import { PicturesService } from './pictures.service'
import { DateValidationPipe } from './validation/DateValidationPipe'

type FetchUrlsResponse = {
    urls: string[]
}

@ApiTags('pictures')
@Controller('/pictures')
export class PicturesController {
    constructor(private readonly picturesService: PicturesService) {}

    @Get()
    @ApiQuery({ name: 'from', type: 'string' })
    @ApiQuery({ name: 'to', type: 'string' })
    @ApiResponse(
        {
            schema: {
                properties: {
                    urls: {
                        type: 'string'
                    }
                }
            },
            status: HttpStatus.OK,
        }
    )
    @ApiBadRequestResponse({
        description: 'Dates validation problem: empty, invalid format or another irregularity',
    })
    @ApiBadGatewayResponse({
        description: 'Could not obtain data from NASA APOD API',
    })
    @HttpCode(HttpStatus.OK)
    async index(
        @Query(DateValidationPipe) date: any,
    ): Promise<FetchUrlsResponse | never> {
        return {
            urls: await this.picturesService.fetchNasaAPODPictures(date.from, date.to),
        }
    }
}
