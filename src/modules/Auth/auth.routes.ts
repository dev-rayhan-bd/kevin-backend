import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../app/middleware/validateRequest';

import { AuthControllers } from './auth.controller';

import auth from '../../app/middleware/auth';
import { AuthValidation } from './auth.validation';
import { USER_ROLE } from './auth.constant';
import { upload } from '../../app/middleware/multer';


const router = express.Router();

router.post(
  '/register',
     upload.single('image'),
       (req: Request, res: Response, next: NextFunction) => {
      // console.log("req--->",req.body);
   if(req.body.data){
         req.body = JSON.parse(req.body.data);
   }
        next();
    },

  validateRequest(AuthValidation.registerUserValidationSchema),


  AuthControllers.registerUser,
);
router.post('/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.userLogin
);
router.post('/changePassword',
    auth(
        USER_ROLE.contractor,
        USER_ROLE.user,
        USER_ROLE.admin,
        USER_ROLE.vipContractor,
        USER_ROLE.vipMember,
      ),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword
)
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);
router.post(
  '/forgotPass',
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthControllers.forgotPassword,
);
router.post(
  '/resetPass',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);
router.post(
  '/verifyOtp',
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthControllers.verifyYourOTP,
);


export const AuthRoutes = router;
