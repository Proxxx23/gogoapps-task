import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';

// This class is used instead of ThrottlerGuard to respond with specific { error: 'Message' } manner
export class PicturesThrottlerGuard extends ThrottlerGuard {
    protected throwThrottlingException() {
        throw new HttpException({ error: 'Trying to make too many requests to NASA APOD API.' }, HttpStatus.TOO_MANY_REQUESTS);
    }
}
