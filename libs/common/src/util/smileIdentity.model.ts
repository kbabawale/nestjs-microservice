export interface SmileIdentityPayload {
  source_sdk: string;
  source_sdk_version: string;
  partner_id: string;
  timestamp: string;
  signature: string;
  country: string;
  id_type: string;
  id_number: string;
  callback_url?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone_number?: string;
  dob?: string;
  gender?: string;
  partner_params: {
    job_id: string;
    job_type?: string;
    user_id: string;
  };
}

export enum SmileIdentityCode {
  'Exact Match' = 'Exact Match',
  'Partial Match' = 'Partial Match',
  'Transposed' = 'Transposed',
  'Not Provided' = 'Not Provided',
  'No Match' = 'No Match',
}

export interface SmileIdentityResult {
  JSONVersion: string;
  SmileJobID: string;
  PartnerParams: {
    user_id: string;
    job_id: string;
    job_type: number;
  };
  ResultType: string;
  ResultText: SmileIdentityCode;
  ResultCode: string;
  IsFinalResult: string;
  Actions: {
    Return_Personal_Info: string;
    Verify_ID_Number: string;
    Names: SmileIdentityCode;
    DOB: SmileIdentityCode;
    Gender: SmileIdentityCode;
    Phone_Number: SmileIdentityCode;
    ID_Verification: SmileIdentityCode;
  };
  Source: string;
  signature: string;
  timestamp: string;
  FullName: string;
  DOB: string;
  photo: string;
  PhoneNumber: string;
}
