/* eslint-disable @typescript-eslint/no-explicit-any */

import { CMSModel } from './cms.model';


const getCMSDataFromDB = async (pageKey: string) => {
  return await CMSModel.findOne({ pageKey });
};


const updateCMSDataIntoDB = async (pageKey: string, payload: any) => {
  return await CMSModel.findOneAndUpdate(
    { pageKey },
    { $set: payload },
    { upsert: true, new: true, runValidators: true }
  );
};

export const CMSService = {
  getCMSDataFromDB,
  updateCMSDataIntoDB,
};