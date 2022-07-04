import { HttpException, HttpStatus } from "@nestjs/common";

export class CertyError extends HttpException {
  constructor(
    message = 'error.sso.login',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}
