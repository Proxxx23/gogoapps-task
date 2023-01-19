import { parseISO, isAfter, isValid, isBefore } from 'date-fns'
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

type FromToQuery = {
    from: string,
    to: string,
}

@Injectable()
export class DateValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any {
        if (!this.isValidQuery(value)) {
            throw new BadRequestException(`Query param "${metadata.data}" is required.`);
        }

        const startDate = parseISO(value.from);
        const endDate = parseISO(value.to);

        if (!isValid(startDate)) {
            throw new BadRequestException('Start date has invalid ISO8601 date format.');
        }

        if (!isValid(endDate)) {
            throw new BadRequestException('End date has invalid ISO8601 date format.');
        }

        if (isBefore(endDate, startDate)) {
            throw new BadRequestException('End date is before start date.');
        }

        if (isAfter(startDate, new Date())) {
            throw new BadRequestException('Start date date is after today\'s date.');
        }

        if (isAfter(endDate, new Date())) {
            throw new BadRequestException('End date is after today\'s date.');
        }

        return value;
    }

    isValidQuery(value: any): value is FromToQuery {
        return 'from' in value && 'to' in value;
    }
}
