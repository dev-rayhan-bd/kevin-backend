export interface ISocialLink {
  platform: string;
  url: string;
}

export interface IFooter {
  address: string;
  email: string;
  phone: string;
  copyRightText: string;
  socialLinks: ISocialLink[];
}
export interface ISection {
  title?: string;
  content?: string;
  image?: string;
   features?: string[];
  isVisible: boolean;
}

export interface INavItem {
  label: string;
  path?: string;
  isVisible: boolean;
}

export interface ICMS {
  pageKey: string; // 'home', 'interior', 'exterior', 'lawn-garden', 'specialized', 'articles', 'referral', 'membership', 'global'
    landingPage?: {
    banner: ISection;
    projectsNear: ISection;
    contractorNear: ISection;
    recentArticle: ISection;
  };


  loggedInPage?: {
    welcomeBanner: ISection;
    services: ISection;
    expertContractor: ISection;
    membershipBanner: ISection;
    recentArticle: ISection;
  };
   footer?: IFooter; 
  sections?: Record<string, ISection>; // dynamic section like 'banner', 'about'
  branding?: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
  };
  navigation?: INavItem[];
  sidebar?: INavItem[];
}