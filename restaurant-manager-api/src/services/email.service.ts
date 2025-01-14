import {BindingScope, injectable} from '@loopback/core';
import nodemailer from 'nodemailer';

@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'datd80224@gmail.com',
        pass: 'uefy xnji thhk xsav',
      },
    });
  }

  async sendEmail(to: string, subject: string, content: any): Promise<void> {
    const mailOptions = {
      from: 'datd80224@gmail.com',
      to,
      subject,
      ...(typeof content === 'string' ? {text: content} : {html: content}),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
