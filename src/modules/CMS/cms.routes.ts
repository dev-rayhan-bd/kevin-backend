import express from 'express';
import auth from '../../app/middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';

import { CMSController } from './cms.controller';

import { upload } from '../../app/middleware/multer';

const router = express.Router();

router.get('/home', CMSController.getHomePageData);

router.patch(
  '/home/update', 
  auth(USER_ROLE.admin), 
  upload.single('image'), 
  CMSController.updateHomePage
);

export const CMSRoutes = router;