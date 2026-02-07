import { NextFunction, Request, Response } from 'express';

import sendResponse from '../../app/utils/sendResponse';

import httpStatus from 'http-status';

import { BookServices } from './bookservice.services';
import catchAsync from '../../app/utils/catchAsync';
import { projectStatus, ServiceStatus } from './bookservice.interface';





const getSpecUserBookService = catchAsync(async(req:Request,res:Response)=>{
  const {userId}=req.params;

  const result = await BookServices.getSpecUserBookServiceFromDB(userId as string);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order retrived succesfully!',
      data: result,
    });

})
const getAllBookedServices = catchAsync(async(req:Request,res:Response)=>{


  const result = await BookServices.getAllOrderedServiceFromDB(req?.query);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order retrived succesfully!',
      data: result,
    });

})
const getAllBookedServicesForSingleContractor = catchAsync(async(req:Request,res:Response)=>{
const meId = req?.user?.userId

  const result = await BookServices.getAllSingleContrctrOrderFromDB(meId as string);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order retrived succesfully!',
      data: result,
    });

})

const createBookService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
const meId = req?.user?.userId
  try {
    const result = await BookServices.addBookServicesIntoDB(req.body,meId as string)

    sendResponse(res, {
      success: true,
      message: 'Service Booked Sucessfully',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};


const updateStatusAsBooked = catchAsync(async(req:Request,res:Response)=>{
  const {serviceId}=req.params;


  const status = req.query?.status as string;

  // Validate status
  const validStatuses: ServiceStatus[] = ["booked", "onTheWay", "started", "done"];
  if (!validStatuses.includes(status as ServiceStatus)) {
    throw new Error("Invalid status provided");
  }
  const result = await BookServices.updateProjectStatusAsBooked(serviceId,status as ServiceStatus
);

  sendResponse(res, {
      statusCode:httpStatus.OK,
      success:true,
      message:`Service is ${status}!`,
      data:result,
    });

})

const updateAssignTask = catchAsync(async(req:Request,res:Response)=>{
  const payload=req.body;

  // eslint-disable-next-line no-undef
  const files = req.files as Express.Multer.File[] ;


  // const image  =files?.map((file: any) => file.path) as any
// console.log("req files image",image);


  // Construct the full image URLs
  // eslint-disable-next-line no-undef
  const image = files?.map((file: Express.Multer.File) => {
    const path = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return path;
  });

  const result = await BookServices.updateAssignedTaskInDB(payload,image);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Task is updated',
      data: result,
    });

})
const rejectSingleProject = catchAsync(async(req:Request,res:Response)=>{
  const {serviceId}=req.params;

  const result = await BookServices.rejectProject(serviceId);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book Service is rejected succesfully!',
      data: result,
    });

})

const getSingleBookedOrder = catchAsync(async(req:Request,res:Response)=>{
  const {id}=req.params;

  const result = await BookServices.getSingleBookedOrderFromDB(id as string);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order Retrived Success',
      data: result,
    });

})

const acceptOrRejectProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.log("create contractor-->",req.body);
    const id = req?.params?.id;
 
      const status = req.query?.status as string;

  // Validate status
  const validStatuses: projectStatus[] = ["pending", "accepted", "rejected"];
  if (!validStatuses.includes(status as projectStatus)) {
    throw new Error("Invalid status provided");
  }

  try {
    const result = await BookServices.acceptOrRejectProjectIntoDb(status as projectStatus,id as string);

    sendResponse(res, {
      success: true,
      message: `Project Offer ${status}`,
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const BookServicesControllers = {
createBookService,getSpecUserBookService,getAllBookedServices,rejectSingleProject,updateStatusAsBooked,updateAssignTask,getAllBookedServicesForSingleContractor,getSingleBookedOrder,acceptOrRejectProject
};
