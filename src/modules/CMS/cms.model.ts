import { Schema, model, Document } from 'mongoose';

export interface ISection {
  title: string;
  content: string;
  image: string;
  isVisible: boolean;
}

interface IHomePageCMS extends Document {
  pageName: string; // "Home"
  // লগইন ছাড়া হোমপেজ (Landing Page)
  landingPage: {
    banner: ISection;
    projectsNear: ISection;
    contractorNear: ISection;
    recentArticle: ISection;
  };
  // লগইন করার পর হোমপেজ (Home Page)
  loggedInPage: {
    welcomeBanner: ISection;
    services: ISection;
    expertContractor: ISection;
    membershipBanner: ISection;
    recentArticle: ISection;
  };
}

const SectionSchema = new Schema<ISection>({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  isVisible: { type: Boolean, default: true },
}, { _id: false });

const HomePageCMSSchema = new Schema<IHomePageCMS>({
  pageName: { type: String, required: true, unique: true, default: "Home" },
  landingPage: {
    banner: SectionSchema,
    projectsNear: SectionSchema,
    contractorNear: SectionSchema,
    recentArticle: SectionSchema,
  },
  loggedInPage: {
    welcomeBanner: SectionSchema,
    services: SectionSchema,
    expertContractor: SectionSchema,
    membershipBanner: SectionSchema,
    recentArticle: SectionSchema,
  }
}, { timestamps: true });

export const HomePageCMSModel = model<IHomePageCMS>('HomePageCMS', HomePageCMSSchema);