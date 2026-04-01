import express from 'express';
import auth from '../../app/middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { CMSController } from './cms.controller';
import { upload } from '../../app/middleware/multer';

const router = express.Router();


router.get('/:pageKey', CMSController.getCMSData);


router.patch(
  '/:pageKey', 
  auth(USER_ROLE.admin), 
  upload.single('image'), 
  CMSController.updateCMS
);

export const CMSRoutes = router;