import { parseISO, isAfter, isValid, isBefore } from 'date-fns';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

type FromToQuery = {
    from: string,
    to: string,
};

@Injectable()
export class DateValidationPipe implements PipeTransform {
    transform(value: any, _: ArgumentMetadata): any {
        if (!this.isValidQuery(value)) {
            throw new BadRequestException('Both "from" and "to" query params are required.');
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

        if (isAfter(endDate, new Date())) {
            throw new BadRequestException('End date is after today\'s date.');
        }

        return value;
    }

    isValidQuery(value: any): value is FromToQuery {
        return 'from' in value && 'to' in value;
    }
}
