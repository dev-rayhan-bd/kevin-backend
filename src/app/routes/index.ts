import { Router } from 'express';
import { AuthRoutes } from '../../modules/Auth/auth.routes';
import { UserRoutes } from '../../modules/User/user.routes';
import { quoteRoutes } from '../../modules/Quote/quote.routes';
import { reviewRoutes } from '../../modules/Review/review.routes';
import { servicesRoutes } from '../../modules/Services/services.routes';
import { BookServicesRoutes } from '../../modules/BookService/bookservice.routes';
import { ArticleRoutes } from '../../modules/Article/article.routes';
import { referRoutes } from '../../modules/Refferal/refferal.routes';
import { vipMemberRoutes } from '../../modules/VipMember/vipmember.routes';
import { FlagRoutes } from '../../modules/Flag/flag.routes';
import { PlatformRoutes } from '../../modules/ManagePlatform/platform.routes';
import { CategoryRoutes } from '../../modules/Category/category.routes';
import { notificationRoutes } from '../../modules/Notification/notification.routes';
import { conversationRoutes } from '../../modules/Conversation/conversation.routes';
import { messageRoutes } from '../../modules/message/message.route';
import { ReferClaimRoutes } from '../../modules/ReferClaim/referclaim.route';
import { documentVerificationRoutes } from '../../modules/DocumentVerification/verification.routes';
import privacyPolicyRouter from '../../modules/PrivacyPolicy/privacyPolicy.routes';
import termsRouter from '../../modules/Terms/terms.route';
import { MembershipRoutes } from '../../modules/Membership/membership.route';
import { vipContractorRoutes } from '../../modules/VipContractor/vipcontractor.routes';
import { CMSRoutes } from '../../modules/CMS/cms.routes';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/quotes',
    route: quoteRoutes,
  },
  {
    path: '/review',
    route: reviewRoutes,
  },
  {
    path: '/service',
    route: servicesRoutes,
  },
  {
    path: '/book',
    route: BookServicesRoutes,
  },
  {
    path: '/article',
    route: ArticleRoutes,
  },
  {
    path: '/refer',
    route: referRoutes,
  },
  {
    path: '/refer-claim',
    route: ReferClaimRoutes,
  },
  {
    path: '/vipMember',
    route: vipMemberRoutes,
  },
  {
    path: '/flag',
    route: FlagRoutes,
  },
  {
    path: '/platform',
    route: PlatformRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/notification',
    route: notificationRoutes,
  },
  {
    path: '/conversation',
    route: conversationRoutes,
  },
  {
    path: '/message',
    route: messageRoutes,
  },
  {
    path: '/verify',
    route: documentVerificationRoutes,
  },
  {
    path: '/privacy',
    route: privacyPolicyRouter,
  },
  {
    path: '/terms',
    route: termsRouter,
  },
  {
    path: '/membership',
    route:MembershipRoutes,
  },
  {
    path: '/vipContractor',
    route:vipContractorRoutes,
  },
  {
    path: '/cms',
    route:CMSRoutes,
  },
 
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
