import { Request, Response } from 'express';

import httpStatus from 'http-status';
import notificationServices from './notification.services';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';

// getAllNotifications
const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const result = await notificationServices.getAllNotificationsFromDB(
    req.query,
    userId as string,
  );

  sendResponse(res, {
    success: true,
    message: 'Notification seen successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

// markANotificationAsRead
const markANotificationAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const notificationId = req.params.id;
    const result =
      await notificationServices.markANotificationAsReadIntoDB(notificationId as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notification marked as read successfully!',
      data: result,
    });
  },
);

// markNotificationsAsRead
const markNotificationsAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    const result =
      await notificationServices.markNotificationsAsReadIntoDB(userId as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All notifications marked as read successfully!',
      data: result,
    });
  },
);

// getUnseenNotificationCount
const getUnseenNotificationCount = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    const result =
      await notificationServices.getAllUnseenNotificationCountFromDB(userId as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Unseen notification count fetched successfully',
      data: result,
    });
  },
);

export default {
  getAllNotifications,
  markANotificationAsRead,
  markNotificationsAsRead,
  getUnseenNotificationCount,
};
