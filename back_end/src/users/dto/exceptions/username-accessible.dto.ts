import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameIsNotAccessibleException extends HttpException {
  constructor(message: string) {
    super(message || 'username is not accessible', HttpStatus.FORBIDDEN);
  }
}
