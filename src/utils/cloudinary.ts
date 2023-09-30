import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { UploadImageType } from '~/constants/type';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
export const cloudinaryUploadImage = async (fileToUploads: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads, (error: any, result: UploadApiResponse) => {
      if (error) return reject(error);
      resolve({ url: result.url, asset_id: result.asset_id, public_id: result.public_id });
    })
  })
}
export const cloudinaryDeleteImage = async (fileToDelete: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(fileToDelete, (error: any, result: UploadApiResponse) => {
      if (error) return reject(error);
      resolve({ url: result.url, asset_id: result.asset_id, public_id: result.public_id });
    })
  })
}
