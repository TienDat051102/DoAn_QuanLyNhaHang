import {inject} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import {EmailService} from '../services/email.service';

export class EmailController {
  constructor(
    @inject('services.EmailService') private emailService: EmailService,
  ) {}

  @post('/email/sendemail')
  async sendEmail(@requestBody() body: any): Promise<any> {
    try {
      await this.emailService.sendEmail(body.to, body.subject, body.html);
      return 'Email sent successfully';
    } catch (e) {
      return {message: 'Xuất hiện lỗi', e};
    }
  }
}
