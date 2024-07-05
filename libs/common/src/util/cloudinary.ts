/**
 *
 * @returns Generates a cloudinary signature
 */
export const generateSignature = () => {
  const cloudinary = require('cloudinary').v2;
  const timestamp = Math.round(new Date().getTime() / 1000);

  const cloudinaryConfig = cloudinary.config({
    secure: true,
    cloud_name: 'x',
    api_secret: 'x',
    api_key: 'x',
  });

  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    cloudinaryConfig.api_secret,
  );

  return { signature, timestamp };
};
