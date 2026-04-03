import { Server } from 'http';

import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { initializeSocket } from './utils/socket';


let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

  server = app.listen(Number(config.port), "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${config.port}`);
});

    initializeSocket(server);
  } catch (err) {
    console.log(err);
  }
}
main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
