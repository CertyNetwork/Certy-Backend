import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from '../dto/login.dto';

export class SignInOauthCommand implements ICommand {
  constructor(public loginDto: LoginDto) {}
}

@CommandHandler(SignInOauthCommand)
export class SignInOauthHandler
  implements ICommandHandler<SignInOauthCommand, any>
{
  constructor() {
    //
  }

  async execute(command: SignInOauthCommand): Promise<any> {
    const { loginDto } = command;
    try {
      return {
        status: 'OK',
      };
    } catch (e) {
      //
    }
  }
}
