import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class UserService {
  constructor(
    protected commandBus: CommandBus,
  ) {}
}
