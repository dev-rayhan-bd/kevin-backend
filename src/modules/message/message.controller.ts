/* eslint-disable @typescript-eslint/no-explicit-any */

import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { messageService } from './message.service';
import httpStatus from 'http-status';

// get Users For Sidebar
const getUsersForSidebar = catchAsync(async (req, res) => {
  const result = await messageService.getUsersForSidebarFromDB(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

// get Messages
const getMessages = catchAsync(async (req, res) => {
  const { id: userToChatId } = req.params;

  const result = await messageService.getMessagesFromDB(userToChatId, req.user );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages retrieved successfully!',
    data: result,
  });
});

// send Message
const sendMessage = catchAsync(async (req, res) => {
  const { id: receiverId } = req.params;

  const payload = req.body;

  if (req.file) {
    const path = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    payload.image = path;
  }

  const result = await messageService.sendMessageIntoDB(
    receiverId,
    payload,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message sent successfully!',
    data: result,
  });
});

export const messageController = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};
