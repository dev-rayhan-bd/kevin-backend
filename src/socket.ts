// /* eslint-disable no-console */
// import { Server } from 'http';
// import { Server as IOServer, Socket } from 'socket.io';

//  let ioInstance: IOServer | null = null;

// const userSocketMap: { [userId: string]: string } = {};

// export function initializeSocket(server: Server) {
//   const io = new IOServer(server, {
//     cors: {
//       origin: ['http://localhost:3000', 'http://10.10.20.13:5000',"https://kevin-livid.vercel.app",
//       'https://kevin-admin-dashboard.vercel.app',],
//       // origin: '*', // Adjust for production
//       methods: ['GET', 'POST'],
//     },
//   });

//   ioInstance = io;

//   io.on('connection', (socket: Socket) => {
//     console.log('A user connected', socket.id);

//     const userId = socket.handshake.query.userId as string;

//     if (userId) userSocketMap[userId] = socket.id;

//     io.emit('getOnlineUsers', Object.keys(userSocketMap));

//     socket.on('disconnect', () => {
//       console.log('A user disconnected', socket.id);
//       if (userId !== undefined) {
//         delete userSocketMap[userId];
//       }
//       io.emit('getOnlineUsers', Object.keys(userSocketMap));
//     });
//   });

//   return io;
// }

// export const getIO = () => {
//   if (!ioInstance) {
//     throw new Error(
//       'Socket.io is not initialized. Call initializeSocket first.',
//     );
//   }
//   return ioInstance;
// };

// export function getReceiverSocketId(userId: string): string | undefined {
//   return userSocketMap[userId];
// }
