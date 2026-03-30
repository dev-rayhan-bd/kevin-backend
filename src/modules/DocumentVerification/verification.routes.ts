/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import { VerificationControllers } from './verification.controller';
import auth from '../../app/middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { upload } from '../../app/middleware/multer';


const router = express.Router();

router.post(
  '/document',
  upload.fields([
    { name: 'frontLicense', maxCount: 1 },
    { name: 'backLicense', maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    // Parse the `data` field if it's present
    if (req.body.data) {
      req.body.data = JSON.parse(req.body.data);
    }

    // Logging files and data for debugging
    // console.log("Files received:", req.files);
    // console.log("Data received:", req.body.data);

    next();
  },
  // Validation and handling controller
  auth(USER_ROLE.contractor,USER_ROLE.vipContractor),

  VerificationControllers.createVerification
);

router.get('/single-user-doc',auth(USER_ROLE.contractor,USER_ROLE.vipContractor),VerificationControllers.getSingleDoc)
router.get('/all-doc',auth(USER_ROLE.contractor,USER_ROLE.vipContractor,USER_ROLE.admin),VerificationControllers.getAllDoc)
router.patch('/updateStatus',auth(USER_ROLE.contractor,USER_ROLE.vipContractor,USER_ROLE.admin),VerificationControllers.approveOrReject)

export const documentVerificationRoutes = router;
