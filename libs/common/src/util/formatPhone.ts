import validator from 'validator';

export const formatPhoneForVonage = (phone: string): string => {
  let res = '';

  res = phone.replace('+', '');
  return res;
};

export const validatePhoneNumber = (phone: string): boolean => {
  return validator.isMobilePhone(phone, 'any', { strictMode: true });
};
