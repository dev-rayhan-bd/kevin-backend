import { NextFunction, Request, Response, Router } from 'express';
import { messageController } from './message.controller';
import auth from '../../app/middleware/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { upload } from '../../app/middleware/multer';


const router = Router();

router.get(
  '/users',
  auth(
    USER_ROLE.user,
    USER_ROLE.contractor,
    USER_ROLE.admin,
    USER_ROLE.vipContractor,
    USER_ROLE.vipMember,
  ),
  messageController.getUsersForSidebar,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.user,
    USER_ROLE.contractor,
    USER_ROLE.admin,
    USER_ROLE.vipContractor,
    USER_ROLE.vipMember,
  ),
  messageController.getMessages,
);

router.post(
  '/send/:id',
  upload.single('image'),
  auth(
    USER_ROLE.user,
    USER_ROLE.contractor,
    USER_ROLE.admin,
    USER_ROLE.vipContractor,
    USER_ROLE.vipMember,
  ),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  messageController.sendMessage,
);

export const messageRoutes = router;
