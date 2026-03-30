/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';

import { ArticleControllers } from './article.controller';
import { articleZodSchema } from './article.validation';
import { upload } from '../../app/middleware/multer';

const router = express.Router();

router.post(
  '/create-article',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("req data--->",req.body.data);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },

  auth(
    USER_ROLE.vipContractor,
    USER_ROLE.contractor,
    USER_ROLE.admin,
    USER_ROLE.vipMember,
  ),
  validateRequest(articleZodSchema),
  ArticleControllers.createArticle,
);

// router.get('/retrive/:userId',UserControllers.getSingleUser)

router.get('/allArticle', ArticleControllers.getAllArticle);

router.get('/single-article/:id', ArticleControllers.getSingleArticle);
router.get('/single-user-article',auth(
    USER_ROLE.vipContractor,
    USER_ROLE.contractor,
    USER_ROLE.admin,
    USER_ROLE.vipMember,
  ), ArticleControllers.getSingleUserArticle);

router.delete('/delete-article/:id', ArticleControllers.deleteArticle);
router.patch('/update-status', ArticleControllers.approveOrReject);

export const ArticleRoutes = router;
