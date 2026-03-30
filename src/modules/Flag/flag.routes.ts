/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';
import { createFlagUserSchema } from './flag.validation';
import { FlagControllers } from './flag.controller';
import { upload } from '../../app/middleware/multer';




const router = express.Router();

router.post('/addFlag',
    upload.single('image'),
       (req: Request, res: Response, next: NextFunction) => {
      // console.log("req data--->",req.body.data);
   if(req.body.data){
         req.body = JSON.parse(req.body.data);
   }
        next();
    },
  auth(USER_ROLE.admin),
  validateRequest(createFlagUserSchema),
FlagControllers.createFlag,

);

// router.get('/allUser',UserControllers.getAllUser)

export const FlagRoutes = router;
