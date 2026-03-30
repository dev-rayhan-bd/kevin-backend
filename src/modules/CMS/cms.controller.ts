/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { HomePageCMSModel } from './cms.model'; 
import uploadImage from '../../app/middleware/upload';

const getHomePageData = catchAsync(async (req: Request, res: Response) => {
  const result = await HomePageCMSModel.findOne({ pageName: "Home" });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Home CMS data fetched',
    data: result,
  });
});

const updateHomePage = catchAsync(async (req: Request, res: Response) => {
  let rawData = {};
  if (req.body.data) {
    rawData = JSON.parse(req.body.data);
  }

  const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: any, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (
        typeof obj[k] === 'object' &&
        obj[k] !== null &&
        !Array.isArray(obj[k])
      ) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const updateData = flattenObject(rawData);

  
  if (req.file) {
    try {
      const imageUrl = await uploadImage(req);
      const sectionPath = req.body.sectionPath; // "loggedInPage.membershipBanner"

      if (sectionPath) {
  
        updateData[`${sectionPath}.image`] = imageUrl;
      }
    } catch (uploadError: any) {
      throw new Error(uploadError.message || "Cloudinary upload failed");
    }
  }


  const result = await HomePageCMSModel.findOneAndUpdate(
    { pageName: "Home" },
    { $set: updateData }, 
    { upsert: true, new: true }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Home section updated successfully',
    data: result,
  });
});

export const CMSController = { getHomePageData, updateHomePage };