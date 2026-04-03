/* eslint-disable no-console */
import { Server } from 'http';
import { Server as IOServer, Socket } from 'socket.io';

import { Secret } from 'jsonwebtoken';
import { verifyToken } from '../modules/Auth/auth.utils';
import config from '../app/config';

let ioInstance: IOServer | null = null;
const userSocketMap: { [userId: string]: string } = {};

export function initializeSocket(server: Server) {
  const io = new IOServer(server, {
    cors: { origin: "*", methods: ['GET', 'POST'] },
  });

  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    // প্যারামস থেকে টোকেন নেওয়া
    const token = socket.handshake.query.token as string;
    let userId: string | null = null;

    if (token && token !== "undefined") {
      try {
        const decoded = verifyToken(token, config.jwt_access_secret as Secret);
        userId = decoded.userId;
        if (userId) {
          userSocketMap[userId] = socket.id;
          console.log(`✅ Socket Map: User ${userId} is at Socket ${socket.id}`);
        }
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("❌ Socket Auth Error: Invalid Token");
      }
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      if (userId) delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });
  return io;
}

export const getIO = () => {
  if (!ioInstance) throw new Error('Socket.io is not initialized.');
  return ioInstance;
};

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}