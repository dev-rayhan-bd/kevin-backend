/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';
import {
  editContractorProfileSchema,
  editProfileSchema,
  UserReviewValidationSchema,
  userValidation,
} from './user.validation';
import { USER_ROLE } from '../Auth/auth.constant';
import { UserControllers } from './user.controller';
import { upload } from '../../app/middleware/multer';


const router = express.Router();

router.post(
  '/change-status/:id',
  auth(USER_ROLE.user),
  validateRequest(userValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);
router.patch(
  '/change-profilePic/:id',
  upload.single('image'),
  auth(USER_ROLE.user, USER_ROLE.contractor),
  // validateRequest(userValidation.changeStatusValidationSchema),
  UserControllers.changeProPic,
);
router.post(
  '/create-contractor',
  auth(USER_ROLE.user),
  validateRequest(userValidation.becomeContractorValidationSchema),
  UserControllers.createContractor,
);
router.get('/retrive/:userId', UserControllers.getSingleUser);

router.patch(
  '/report/:userId',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req--->",req.body);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  UserControllers.addReport,
);

router.patch(
  '/feedback/:userId',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req--->",req.body);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  auth(
    USER_ROLE.user,
    USER_ROLE.contractor,
    USER_ROLE.vipContractor,
    USER_ROLE.vipMember,
  ),
  UserControllers.addFeedback,
);
router.patch(
  '/feedbackReply/:userId',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req--->",req.body);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  auth(USER_ROLE.admin),
  UserControllers.replyFeedback,
);

router.patch(
  '/edit-profile/:id',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req--->",req.body);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(editProfileSchema),
  UserControllers.updateProfile,
);

router.patch(
  '/edit-contractor-profile/:id',
  upload.fields([
    // { name: 'image', maxCount: 1 },
    { name: 'thumbnailImage', maxCount: 3 },
    { name: 'video', maxCount: 3 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {


      req.body = JSON.parse(req.body.data);

 
  }
    next();
  },
  // validateRequest(editContractorProfileSchema),
  auth(USER_ROLE.vipContractor,USER_ROLE.contractor),
  UserControllers.updateContractorProfile,
);

router.delete('/deleteUser/:userId', UserControllers.deleteUser);
router.patch('/updateSubscriptionStatus',auth(USER_ROLE.contractor,
    USER_ROLE.vipContractor,
    USER_ROLE.vipMember,USER_ROLE.user), UserControllers.updateUserStatus);


router.get('/allUser', UserControllers.getAllUser);
router.get('/allFeedback', UserControllers.getAllFeedback);
router.get('/dashboard/stats', UserControllers.getDashboardStats);




router.post('/addReview',

  auth(USER_ROLE.contractor,USER_ROLE.vipContractor),
  validateRequest(UserReviewValidationSchema),
  UserControllers.createReview,

);

router.get('/allReview/:id',auth(
    USER_ROLE.contractor,
    USER_ROLE.vipContractor,
    USER_ROLE.vipMember,
    USER_ROLE.user,
  ),UserControllers.getAllReview)







export const UserRoutes = router;
 