/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { UserServices } from './user.services';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  TEditContractorProfile,
  TEditProfile,
  TProfilePictureUpdatePayload,
} from './user.constant';

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated succesfully',
    data: result,
  });
});
const changeProPic = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    //  Check if file is uploaded
    if (!req.file) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Image file is required');
    }

    // Get file path or filename from multer
    const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;

    //  Prepare typed payload
    const payload: TProfilePictureUpdatePayload = {
      image: path,
    };

    //  Update user's image field
    const result = await UserServices.changeProfilePicture(id as string, payload);

    //  Send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile picture updated successfully',
      data: result,
    });
  },
);
const updateProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
       const id = req.params.id;

    // Prepare payload for the update
    const payload: TEditProfile = { ...req.body };

    // Only add the image to the payload if a new image was uploaded
    if (req.file) {
      const path = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // for local machine
      payload.image = path; // Add the new image URL to the payload
    }

    // Update user's profile in the database
    const result = await UserServices.updateProfileFromDB(id as string, payload);

    // Send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile updated successfully',
      data: result,
    });
  },
);
const updateContractorProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    // eslint-disable-next-line no-undef
    const files = req.files as Record<string, Express.Multer.File[]>;


    const thumbnailPaths = files?.thumbnailImage
      ? files.thumbnailImage.map(
          (file) =>
            `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        )
      : [];
    const videoPaths = files?.video
      ? files.video.map(
          (file) =>
            `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        )
      : [];

  

    // Extract titles from the request body (assuming titles are passed as an array)
    const videoTitles = req.body.videoTitles || [];

    // Ensure the number of titles matches the number of videos
    if (videoTitles.length !== videoPaths.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'The number of titles must match the number of videos.',
      );
    }

    //  Prepare the profile videos array
    const profileVideos = videoPaths.map((videoUrl, index) => {
      return {
        thumbImageUrl: thumbnailPaths[index] || '',
        title: videoTitles[index] || '', // Assign the title based on index
        videoUrl,
      };
    });

    //  Prepare the full payload
    const payload: TEditContractorProfile = {
      ...req.body,
      // image: imagePath, 
      profileVedio: profileVideos,
    };

    //  Update contractor profile in DB
    const result = await UserServices.updateContractorProfileFromDB(
      id as string,
      payload,
    );

    // Send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Contractor Profile updated successfully',
      data: result,
    });
  },
);

const addReport = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  // console.log("request",req.body);
  const reportData = req.body.report;
  const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
  reportData.image = path;
  // console.log("reported data--->",reportData);
  const result = await UserServices.addReportToContractor(userId as string, reportData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Report added to contractor successfully',
    data: result,
  });
});
const addFeedback = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  // console.log("request",req.file);
  const feedbackData = req.body.feedback;
  const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
  // console.log("request iamge",image);
  feedbackData.image = path;
  // console.log("feedback data--->",feedbackData);

  const result = await UserServices.addFeedbackToContractor(
    userId as string,
    feedbackData,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback  added to user ',
    data: result,
  });
});
const replyFeedback = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const message = req.body.message as string | undefined;
  const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;

  if (!message && !path) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  const update: any = {};
  if (message !== undefined) update['feedback.reply.message'] = message;
  if (path) update['feedback.reply.image'] = path;
  update['feedback.reply.repliedAt'] = new Date();

  const result = UserServices.replyFeedbackByAdmin(userId, update);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback Send Successfull',
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUserFromDB(req?.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrived succesfully!',
    data: result,
  });
});
const getAllFeedback = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllFeedbackFromDB(req?.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback retrived succesfully!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserServices.getSingleUserFromDB(userId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrived succesfully!',
    data: result,
  });
});


const createContractor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   console.log("create contractor-->",req.body);
  try {
    const result = await UserServices.updateUserToContractor(req.body);

    sendResponse(res, {
      success: true,
      message: 'Contractor role activated',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserServices.deleteUserFromDB(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully!',
    data: result,
  });
});
const getDashboardStats = catchAsync(async (req: Request, res: Response) => {


  const result = await UserServices.getDashboardStatsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard stats retrive successfully!',
    data: result,
  });
});

const updateUserStatus = async (req: Request, res: Response) => {

    const  userId  =req?.user?.userId
    const { status } = req.body;


    // Call the service to update the user's status
    const updatedUser = await UserServices.updateUserStatusService(userId as string, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supscription Purchase successfull',
    data: updatedUser,
})};

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log("create revieew-->",req.body);
const  reviewBy  =req?.user?.userId
// console.log("reviewBy----->",reviewBy);
const data =  req?.body
const payload ={
  reviewBy,
  userId:data?.userId,
  rating :data.rating,
  comment:data.comment


}
  try {
    const result = await UserServices.addReviewIntoDB(payload);

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


const getAllReview = catchAsync(async(req:Request,res:Response)=>{
 const userId = req?.params?.id
 console.log("userId--->",userId);
  const result = await UserServices.getAllReviewFromDB({userId });
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review retrived succesfully!',
      data: result,
    });

})







export const UserControllers = {
  changeStatus,
  getSingleUser,
  getAllUser,
  createContractor,
  changeProPic,
  addReport,
  addFeedback,
  updateProfile,
  deleteUser,
  replyFeedback,
  updateContractorProfile,
  getAllFeedback,
  getDashboardStats,
  updateUserStatus,createReview,getAllReview
};
