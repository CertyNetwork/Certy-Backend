import { Post, Body, Controller } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from 'decorators/public.decorator';
import { WebhookService } from './webhook.service';

@Public()
@Controller('webhook')
@ApiExcludeController()
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('vouched-id')
  handVouchedId(@Body() body) {
    return this.webhookService.handleVouchedIdWebhook(body);
  }
}
