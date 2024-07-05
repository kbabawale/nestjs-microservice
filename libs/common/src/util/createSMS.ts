export const createOTP = (
  length: number = 4,
  alphaNumeric: boolean = false,
): string => {
  let otp: string = '';
  if (alphaNumeric) {
    let digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 1; i <= length; i++) {
      var index = Math.floor(Math.random() * digits.length);

      otp = otp + digits[index];
    }
  } else {
    let digits = '0123456789';
    for (let i = 1; i <= length; i++) {
      var index = Math.floor(Math.random() * digits.length);
      otp = otp + digits[index];
    }
  }
  return otp;
};
