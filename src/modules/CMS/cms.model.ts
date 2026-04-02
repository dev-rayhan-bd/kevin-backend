import { Schema, model, Document } from 'mongoose';
import { ICMS, ISection, INavItem } from './cms.interface';

const SectionSchema = new Schema<ISection>({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
   features: { type: [String], default: [] },
  isVisible: { type: Boolean, default: true },
}, { _id: false });
const FooterSchema = new Schema({
  address: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  copyRightText: { type: String, default: "© 2025 Sparktech. All rights reserved." },
  socialLinks: [
    { platform: String, url: String }
  ]
}, { _id: false });
const NavItemSchema = new Schema<INavItem>({
  label: { type: String, required: true },
  path: { type: String},
  isVisible: { type: Boolean, default: true },
}, { _id: false });

const CMSSchema = new Schema<ICMS & Document>({
  pageKey: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['home', 'interior', 'exterior', 'lawn-garden', 'specialized', 'articles', 'referral', 'membership', 'global'] 
  },
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
  },
   footer: FooterSchema,
  sections: { type: Map, of: SectionSchema },
  branding: {
    logo: { type: String, default: "" },
    primaryColor: { type: String, default: "#1D69E1" },
    secondaryColor: { type: String, default: "#ABE7B4" },
  },
  navigation: [NavItemSchema],
  sidebar: [NavItemSchema],
}, { timestamps: true });

export const CMSModel = model<ICMS & Document>('CMS', CMSSchema);