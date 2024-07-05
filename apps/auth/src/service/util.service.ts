import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import axios, { AxiosError } from 'axios';
import { MailerService } from '@nestjs-modules/mailer';
import {
    PostSMS
  } from '../../../../libs/common/src/util/vonage.model';
  import {
    sendSMS
  } from '../../../../libs/common/src/util/sendSMS';
import {
    SmileIdentityPayload,
    SmileIdentityResult,
  } from '../../../../libs/common/src/util/smileIdentity.model';

@Injectable()
export class UtilService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private mailerService: MailerService){}

  public async generateJWT(
    payload: any,
    expiry: string = '7d',
  ): Promise<string> {
    return jwt.sign(payload, this.config.get('JWT_SECRET'), {
      expiresIn: expiry,
    });
  }

  async sendSMS(
    body: Omit<PostSMS, 'api_key' | 'api_secret'>,
  ): Promise<string | boolean> {
    try {
      let final: PostSMS = {
        ...body,
        api_key: this.config.get('VONAGE_API_KEY'),
        api_secret: this.config.get('VONAGE_API_SECRET'),
      };
      return await sendSMS(final);
    } catch (err) {
      throw err;
    }
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  public async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateRandomPassword(letters: number, numbers: number, either: number) {
    var chars = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', // letters
      '0123456789', // numbers
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // either
    ];

    return [letters, numbers, either]
      .map(function (len, i) {
        return Array(len)
          .fill(chars[i])
          .map(function (x) {
            return x[Math.floor(Math.random() * x.length)];
          })
          .join('');
      })
      .concat()
      .join('')
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
  }

  async validateNIN(body: SmileIdentityPayload): Promise<SmileIdentityResult> {
    try {
      let options = {
        headers: {
          Accept: 'application/json',
        },
      };

      axios.interceptors.response.use(undefined, (error: AxiosError) => {
        let errorMessage = error.message;
        throw new BadRequestException({
          message: errorMessage,
        });
      });

      let { data } = await axios.post(
        `${this.config.get('SMILEIDENTITY_API_URL')}`,
        body,
        options,
      );

      return data;
    } catch (err) {
      throw err;
    }
  }

  
  public async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any = {},
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        // from: '"Support Team" <support@example.com>', // override default from
        subject,
        template, // './confirmation', `.hbs` extension is appended automatically
        context,
      });
    } catch (err) {
      throw err;
    }
  }
}