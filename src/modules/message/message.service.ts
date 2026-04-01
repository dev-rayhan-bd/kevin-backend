import { JwtPayload } from 'jsonwebtoken';
import { Message } from './message.model';
import { TMessage } from './message.interface';

import { getIO, getReceiverSocketId } from '../../socket';
import { Types } from 'mongoose';
import { INotification } from '../Notification/notification.interface';
import { ENUM_NOTIFICATION_TYPE } from '../Notification/notification.constant';
import createAndSendNotification from '../../utils/sendNotification';

// get Users For Sidebar From DB
// const getUsersForSidebarFromDB = async (userData: JwtPayload) => {
//   const filteredUsers = await UserModel.find({
//     _id: { $ne: userData.userId },
//   }).select('-password');

//   return filteredUsers;
// };

const getUsersForSidebarFromDB = async (userData: JwtPayload) => {
  const userId = new Types.ObjectId(userData.userId);


  const recentChats = await Message.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"],
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users", 
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    {
      $project: {
        _id: 1,
        lastMessage: 1,
        firstName: "$userDetails.firstName",
        lastName: "$userDetails.lastName",
        image: "$userDetails.image",
        role: "$userDetails.role", 
      },
    },
    {
      $sort: { "lastMessage.createdAt": -1 }, 
    },
  ]);

  return recentChats;
};
// get Messages From DB
const getMessagesFromDB = async (
  userToChatId: string,
  userData: JwtPayload,
) => {
  const myId = userData.userId;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });

  return messages;
};

// send Message Into DB
const sendMessageIntoDB = async (
  receiverId: string,
  payload: Pick<TMessage, 'text' | 'image'>,
  userData: JwtPayload,
) => {
  const { text, image } = payload;
  const senderId = userData.userId;

  if (!text && !image) {
    throw new Error('Message must contain either text or image');
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text: text || null,
    image: image || null,
  });

  await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId);

  const ioInstance = getIO();
  if (receiverSocketId && ioInstance) {
    ioInstance.to(receiverSocketId).emit('newMessage', newMessage);

    const notificationData: INotification = {
      title: 'New message.',
      message: 'You Have a new message.',
      receiver: newMessage.receiverId,
      type: ENUM_NOTIFICATION_TYPE.USER,
    };

    await createAndSendNotification(
      ioInstance,
      notificationData,
      receiverSocketId,
    );
  }

  return newMessage;
};

export const messageService = {
  getUsersForSidebarFromDB,
  getMessagesFromDB,
  sendMessageIntoDB,
};
