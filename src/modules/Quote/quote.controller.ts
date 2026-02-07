import { NextFunction, Request, Response } from 'express';

import sendResponse from '../../app/utils/sendResponse';

import httpStatus from 'http-status';
import { QuoteServices } from './quote.services';
import catchAsync from '../../app/utils/catchAsync';

const getAllQuoteForSpecContctr = catchAsync(async(req:Request,res:Response)=>{
  const meId = req?.user?.userId;
  const result = await QuoteServices.getAllQuoteForSpecContctrFromDB(meId as string);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Quotes retrived succesfully!',
      data: result,
    });

})
const getSingleQuote = catchAsync(async(req:Request,res:Response)=>{
  const id = req?.params?.id;
  const result = await QuoteServices.getSingleQuoteFromDB(id as string);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Quote retrived succesfully!',
      data: result,
    });

})

const createQuotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.log("create contractor-->",req.body);
    const userId = req?.user?.userId;
    const data= req?.body
    const payload={
...data,user:userId
    }
  try {
    const result = await QuoteServices.addRequestQuoteIntoDB(payload);

    sendResponse(res, {
      success: true,
      message: 'Succesfully send quotes',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateQuoteStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.log("create contractor-->",req.body);
    const quoteId = req?.params?.id;
 
    const status = req?.body?.status

  try {
    const result = await QuoteServices.updateQuoteStatusIntoDB(status,quoteId as string);

    sendResponse(res, {
      success: true,
      message: `Quotes Offer ${status}`,
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// dashboard stats
const getDashStats = catchAsync(async (req: Request, res: Response) => {
  const meId = req?.user?.userId;

  const result = await QuoteServices.dashboardStatsFromDB(meId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard stats retrive successfully',
    data: result,
  });
});

export const QuoteControllers = {
  createQuotes,
  getDashStats,
  getAllQuoteForSpecContctr,
  updateQuoteStatus,
  getSingleQuote
};
