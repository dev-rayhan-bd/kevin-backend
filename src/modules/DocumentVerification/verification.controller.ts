import { NextFunction, Request, Response } from "express";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from 'http-status';
import { verificationServices } from "./verification.services";

import DocumentVerification from "./verification.model";

const createVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("create revieew-->",req.body);
  try {
      const contractor = req?.user?.userId; 
      const documentType =    req?.body?.data?.documentType

  const data = new DocumentVerification({
      contractor,
      documentType,
      frontLicense: '',  
      backLicense: '',   
    });
      
      // eslint-disable-next-line no-undef
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Check if files are uploaded
    if (req.files) {
      // Get file paths for front and back licenses
      const frontLicensePath = files['frontLicense']?.[0]?.filename;
      const backLicensePath = files['backLicense']?.[0]?.filename;

      // If files are uploaded, construct their full URLs
      if (frontLicensePath) {
        data.frontLicense = `${req.protocol}://${req.get('host')}/uploads/${frontLicensePath}`;
      }

      if (backLicensePath) {
        data.backLicense = `${req.protocol}://${req.get('host')}/uploads/${backLicensePath}`;
      }
    }

    // console.log("Data with file paths: ", data);
    
    const result = await verificationServices.addDocumentIntoDB(data)
    sendResponse(res, {
      success: true,
      message: 'Your license has been posted. Please wait for admin approval',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingleDoc = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
  try {
      const contractor = req?.user?.userId; 



    // console.log("Data with file paths: ", data);
    
    const result = await verificationServices.getAllDocumentForSingleUserFromDB(contractor)
    sendResponse(res, {
      success: true,
      message: 'Document Retrived Sucessfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const approveOrReject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
  try {
      const payload = req?.body; 
const id = payload?.id;
const status = payload?.status


    // console.log("Data with file paths: ", data);
    
    const result = await verificationServices.updateDocApproveStatusFromDB(id as string,status)
    sendResponse(res, {
      success: true,
      message: `Document ${status}`,
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};









const getAllDoc = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
//   console.log("create revieew-->",req.body);
  try {
   



    // console.log("Data with file paths: ", data);
    
    const result = await verificationServices.getAllDocumentFromDB()
    sendResponse(res, {
      success: true,
      message: 'Documents Retrived Sucessfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};




export const VerificationControllers = {
createVerification,getSingleDoc,getAllDoc,approveOrReject
};