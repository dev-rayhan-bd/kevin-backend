/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
// import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';
// import { serviceValidationSchema } from './services.validation';
import { servicesControllers } from './services.controller';
import { upload } from '../../app/middleware/multer';




const router = express.Router();

router.post('/addServices',
    upload.single('image'),
       (req: Request, res: Response, next: NextFunction) => {
      // console.log("req data--->",req.body.data);
   if(req.body.data){
         req.body = JSON.parse(req.body.data);
   }
        next();
    },
  auth(USER_ROLE.contractor,USER_ROLE.vipContractor),
  // validateRequest(serviceValidationSchema),
  servicesControllers.createServices,

);

router.get('/allServices',servicesControllers.getAllServices)
router.get('/spec-user-services',  auth(USER_ROLE.contractor, USER_ROLE.vipContractor),servicesControllers.getAllServicesForSpecUser)
router.get('/:id',servicesControllers.getSingleServices)
router.patch('/rejectService/:serviceId',servicesControllers.rejectSingleProject)
router.patch('/acceptService/:serviceId',servicesControllers.acceptSingleProject)
router.post('/checkout',servicesControllers.initiateOrderPayment)
router.post('/checkout/:id',servicesControllers.initiateOrderPayment)
export const servicesRoutes = router;
