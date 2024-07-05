export interface PostSMS {
  from: string;
  text: string;
  to: string;
  api_key: string;
  api_secret: string;
}

export interface PostSMSTwilio {
  accountSid: string;
  authToken: string;
  from: string;
  text: string;
  to: string;
}
