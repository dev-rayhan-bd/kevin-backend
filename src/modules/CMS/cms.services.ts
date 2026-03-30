/* eslint-disable @typescript-eslint/no-explicit-any */
import { HomePageCMSModel } from './cms.model';

const getHomePageData = async () => {
  return await HomePageCMSModel.findOne({ pageName: "Home" });
};

const updateHomePageSection = async (payload: any) => {
  return await HomePageCMSModel.findOneAndUpdate(
    { pageName: "Home" },
    { $set: payload },
    { upsert: true, new: true }
  );
};

export const CMSService = { getHomePageData, updateHomePageSection };