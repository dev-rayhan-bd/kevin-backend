/* eslint-disable @typescript-eslint/no-explicit-any */
// import multer from 'multer';
// import path from 'path';

// // Store in memory or on disk
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // or any directory you prefer
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// export const upload = multer({ storage });
import { Request } from 'express';

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import cloudinary from '../../utils/cloudinary';


const uploadImage = async (
  req: Request,
  // file?: Express.Multer.File,
  file = req.files as any,
): Promise<string> => {
  const target = file ?? req.file;

  if (!target) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please upload a file');
  }


  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'dental-desh', 
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Cloudinary Upload Failed'));
        }
        resolve(result?.secure_url as string);
      }
    );


    uploadStream.end(target.buffer);
  });
};

export default uploadImage;