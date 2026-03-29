import { NextFunction, Request, Response } from 'express';

import sendResponse from '../../app/utils/sendResponse';

import httpStatus from 'http-status';
import { CategoryServices } from './category.services';
import catchAsync from '../../app/utils/catchAsync';

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getAllCategoryFromDB(req?.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrived succesfully!',
    data: result,
  });
});

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.log("create contractor-->",req.body);
  try {
    const result = await CategoryServices.addCategoryIntoDB(req.body);

    sendResponse(res, {
      success: true,
      message: 'Category Added Succesfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {id}=req.params
  //   console.log("create contractor-->",req.body);
  try {
    const result = await CategoryServices.deleteCateFromDB(id as string);

    sendResponse(res, {
      success: true,
      message: 'Category delete Succesfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const createSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.log("create contractor-->",req.body);
  try {
    const result = await CategoryServices.addSubCategoryIntoDB(req.body);

    sendResponse(res, {
      success: true,
      message: 'Sub-category Added Succesfull',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const editCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.log("create contractor-->",req.body);
  const {id}=req.params
  const payload = req.body
  try {
    const result = await CategoryServices.editCategoryFromDB(payload,id as string);

    sendResponse(res, {
      success: true,
      message: 'category   Updated',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const CategoryControllers = {
  createCategory,
  getAllCategory,
  createSubCategory,
  deleteCategory,
  editCategory
};
