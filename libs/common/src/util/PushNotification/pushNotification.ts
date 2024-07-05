import { Injectable } from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase.json';
import {
  BaseMessage,
  Message,
  MessagingPayload,
} from 'firebase-admin/lib/messaging/messaging-api';
import axios from 'axios';

export interface PushNotificationDTO {
  readonly token: string;
  readonly title: string;
  readonly body: string;
}

@Injectable()
export class PushNotificationService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
  }

  async send(pushNotificationDTO: PushNotificationDTO) {
    try {
      const { body, title, token } = pushNotificationDTO;
      const data: Message = {
        token,
        notification: {
          title,
          body,
        },
        android: {
          priority: 'high',
        },
        apns: {
          headers: {
            'apns-priority': '5',
          },
        },
        webpush: {
          headers: {
            Urgency: 'high',
          },
        },
      };

      let res = await admin.messaging().send(data);
    } catch (error) {
      let errorLog = JSON.stringify(error);
      this.sendLog('http://localhost:3002/api/v1/error-log', {
        message: errorLog,
      }).then((res) => {});
      if (
        [
          'The registration token is not a valid FCM registration token',
          'Requested entity was not found.',
          'NotRegistered.',
        ].includes(error.message)
      ) {
        // invalidate current token
        // find the user and remove this token
        console.log('Invalid Token');
      } else {
        // Log it, because is some really unexpected
      }
    }
  }

  async sendLog(url: string, body: any) {
    try {
      let options = {
        headers: {
          Accept: 'application/json',
        },
      };
      await axios.post(url, body, options);
    } catch (err) {}
  }
}
