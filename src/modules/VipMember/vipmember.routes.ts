/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';
import { vipMemberSchema } from './vipmember.validatin';


import { VipMemberControllers } from './vipmember.controller';
import { upload } from '../../app/middleware/multer';




const router = express.Router();

router.post('/askApro/:id',
        upload.single('image'),
       (req: Request, res: Response, next: NextFunction) => {
      // console.log("req--->",req.body);
   if(req.body.data){
         req.body = JSON.parse(req.body.data);
   }
        next();
    },
  auth(USER_ROLE.user,USER_ROLE.contractor,USER_ROLE.vipContractor,USER_ROLE.vipMember),
  validateRequest(vipMemberSchema),
 VipMemberControllers.askAProQues,

);
router.post('/checkout',auth(USER_ROLE.user,USER_ROLE.vipMember),VipMemberControllers.initiateOrderPayment)
// router.get('/allReview',ReviewControllers.getAllReview)

export const vipMemberRoutes = router;
