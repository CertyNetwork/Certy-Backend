import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ApiController = (prefix: string) =>
  applyDecorators(ApiTags(prefix), Controller(prefix));
