/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';

import uploadImage from '../../app/middleware/upload';
import { CMSModel } from './cms.model';

const getCMSData = catchAsync(async (req: Request, res: Response) => {
  const { pageKey } = req.params;

  const result = await CMSModel.findOne({ pageKey });

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Data not found',
      data: null,
    });
  }

  const responseData = result.toJSON(); 

  if (pageKey !== 'global') {
    delete responseData.branding;
    delete responseData.navigation;
    delete responseData.sidebar;
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `${pageKey} data fetched successfully`,
    data: responseData,
  });
});



const updateCMS = catchAsync(async (req: Request, res: Response) => {
  const { pageKey } = req.params;
  let updateData: any = {};

  if (req.body.data) {
    const rawData = JSON.parse(req.body.data);
    const flatten = (obj: any, prefix = '') => {
      const items: Record<string, any> = {}; 
      for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.assign(items, flatten(value, newKey));
        } else {
          items[newKey] = value;
        }
      }
      return items;
    };
    updateData = flatten(rawData);
  }

  if (req.file) {
    try {
      const imageUrl = await uploadImage(req);
      const { sectionPath, isLogo } = req.body;

      if (isLogo === 'true') {
        updateData['branding.logo'] = imageUrl;
      } else if (sectionPath) {

        const finalPath = (pageKey === 'home') ? sectionPath : `sections.${sectionPath}`;
        updateData[`${finalPath}.image`] = imageUrl;
      }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new Error("Image upload failed");
    }
  }

  const result = await CMSModel.findOneAndUpdate(
    { pageKey },
    { $set: updateData },
    { upsert: true, new: true, runValidators: true }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `${pageKey} updated successfully`,
    data: result,
  });
});
export const CMSController = { getCMSData, updateCMS };