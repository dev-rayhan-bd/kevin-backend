import sendResponse from '../../app/utils/sendResponse';
import httpStatus from 'http-status';
import { AuthServices } from './auth.services';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import config from '../../app/config';

// registerUser
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userPayload = req.body;
    // console.log("userpayload--->",userPayload);
    if (req.file) {
      // Store file path or URL
      userPayload.image = req.file.path; // or URL if you're uploading to cloud
    }
    console.log('ueser payload--->', userPayload);
    const result = await AuthServices.registeredUserIntoDB(userPayload);

    sendResponse(res, {
      success: true,
      message: 'User registered successfully',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// userLogin
const userLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  //set refress token on cookies
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    message: 'User Logged in Successfully',
    statusCode: httpStatus.OK,
    data: { accessToken },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  //   console.log("request body",req.body);
  const result = await AuthServices.changePassword(req.user, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log('request body', email);
  const result = await AuthServices.forgotPass(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Otp send succesfully!',
    data: result,
  });
});
const verifyYourOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  // console.log("request body",req.body);
  const result = await AuthServices.verifyOTP(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Otp Verify succesfully!',
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  // console.log('refreshToken',req);
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

export const AuthControllers = {
  registerUser,
  userLogin,
  changePassword,
  refreshToken,
  forgotPassword,
  verifyYourOTP,
};
