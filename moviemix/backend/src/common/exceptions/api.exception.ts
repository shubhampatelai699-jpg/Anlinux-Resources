import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        success: false,
        error: { code, message },
      },
      status,
    );
  }
}
