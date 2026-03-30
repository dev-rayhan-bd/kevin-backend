/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import auth from '../../app/middleware/auth';
import validateRequest from '../../app/middleware/validateRequest';

import { USER_ROLE } from '../Auth/auth.constant';


import { IBookServicesSchema, updateTaskZodSchema } from './bookservice.validation';
import { BookServicesControllers } from './bookservice.controller';
import { upload } from '../../app/middleware/multer';




const router = express.Router();

router.post('/bookServices',
  auth(USER_ROLE.user,USER_ROLE.vipMember),
  validateRequest(IBookServicesSchema),
  BookServicesControllers.createBookService,

);

router.get('/specUserBookServices/:userId',BookServicesControllers.getSpecUserBookService)

router.patch('/updateTask',    
  upload.array('image'),
       (req: Request, res: Response, next: NextFunction) => {
      // console.log("req data for update--->",req.body.data);
   if(req.body.data){
         req.body = JSON.parse(req.body.data);
   }
        next();
    },
     validateRequest(updateTaskZodSchema),
    BookServicesControllers.updateAssignTask)
    
router.get('/myOrder',auth(USER_ROLE.contractor,USER_ROLE.vipContractor),BookServicesControllers.getAllBookedServicesForSingleContractor)
router.patch('/cancelService/:serviceId',BookServicesControllers.rejectSingleProject)
router.get('/booked/:id',BookServicesControllers.getSingleBookedOrder)
router.patch('/booked/:serviceId',BookServicesControllers.updateStatusAsBooked)
router.get('/allBookedOrder',BookServicesControllers.getAllBookedServices)
router.patch('/update-status/:id',auth(USER_ROLE.contractor,USER_ROLE.vipContractor),BookServicesControllers.acceptOrRejectProject)

export const BookServicesRoutes = router;
