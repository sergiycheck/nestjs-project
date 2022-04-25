import { HttpException, HttpStatus } from '@nestjs/common';

export class FailedAuthException extends HttpException {
  constructor(message: string) {
    super(message || 'failed to authorize', HttpStatus.FORBIDDEN);
  }
}
