import { NextFunction, Request, Response } from 'express';

import sendResponse from '../../app/utils/sendResponse';

import httpStatus from 'http-status';
import { ReviewServices } from './review.services';
import catchAsync from '../../app/utils/catchAsync';


const getAllReview = catchAsync(async(req:Request,res:Response)=>{
 const contractorId = req?.user?.userId
  const result = await ReviewServices.getAllReviewFromDB({contractorId });
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review retrived succesfully!',
      data: result,
    });

})

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);;
  try {
    const result = await ReviewServices.addReviewIntoDB(req.body);

    sendResponse(res, {
      success: true,
      message: 'Review Sent Successfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const ReviewControllers = {
createReview,getAllReview
};
