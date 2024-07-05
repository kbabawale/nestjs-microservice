import * as Vonage from '@vonage/server-sdk';
import { PostSMS, PostSMSTwilio } from './vonage.model';
// import * as Twilio from 'twilio';
import parsePhoneNumber from 'libphonenumber-js/min';

export const sendSMS = (body: PostSMS): Promise<string | boolean> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const vonage = new Vonage({
    apiKey: body.api_key,
    apiSecret: body.api_secret,
  });

  return new Promise<string | boolean>((resolve, reject) => {
    vonage.message.sendSms(
      body.from,
      body.to,
      body.text,
      {},
      (err, responseData) => {
        if (err) {
          resolve(err['error-text']);
        } else {
          if (responseData.messages[0]['status'] === '0') {
            resolve(true);
          } else {
            resolve(`${responseData.messages[0]['error-text']}`);
          }
        }
      },
    );
  });
};

export const sendSMSTwilio = (body: PostSMSTwilio) => {
  const twilio = require('twilio')(body.accountSid, body.authToken);
  // const twilio = Twilio(body.accountSid, body.authToken); //{ logLevel: 'debug' }

  return twilio.messages.create({
    body: body.text,
    from: 'Admin',
    to: parsePhoneNumber(body.to).format('E.164'),
    messagingServiceSid: body.accountSid
  });
};
