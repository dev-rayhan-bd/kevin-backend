import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import conversationServices from './conversation.services';
import sendResponse from '../../app/utils/sendResponse';

const createConversation = catchAsync(async (req: Request, res: Response) => {
  const { members: memberIds } = req.body;

  if (!memberIds || !memberIds.length) {
    throw new Error('Member ids are required');
  }

  const conv = await conversationServices.retriveConversationByMemberIds(memberIds );

  if (conv) {
    conv.members = conv.members.filter((memberId) => memberId._id.toString() !== req.user!.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Conversation already exists',
      data: conv,
    });
    return;
  }

  const convPayload = {
    members: memberIds,
    unreadCounts: memberIds.map((memberId: string) => {
      return {
        userId: memberId,
        count: 0,
      };
    }),
  };

  const newConversation = await conversationServices.createConversation(convPayload);

  newConversation.members = newConversation.members.filter((memberId) => memberId._id.toString() !== req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conversation created successfully',
    data: newConversation,
  });
});

const getConversationListByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const conversationList = await conversationServices.retriveConversationListByUserId(userId as string);
  if (!conversationList) {
    throw new Error('Conversation not found');
  }

  // remove user from members and also other chatbots
  for (let i = 0; i < conversationList.length; i++) {
    conversationList[i].members = conversationList[i].members.filter((memberId) => memberId._id.toString() !== userId);
  }

  conversationList.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
   success:true,
    message: 'Conversation fetched successfully',
    data: conversationList,
  });
});

const getConversationById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const conv = await conversationServices.retriveConversationByConversationId(id as string);
  if (!conv) {
    throw new Error('Conversation not found');
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success:true,
    message: 'Conversation fetched successfully',
    data: conv,
  });
});

export default {
  createConversation,
  getConversationById,
  getConversationListByUserId,
};
