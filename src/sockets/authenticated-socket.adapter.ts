import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';

export class AuthenticatedSocketAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);

    server.use(async (socket: any, next) => {
      const tokenPayload: string = socket.handshake?.auth?.token;

      if (!tokenPayload) {
        return next(new Error('Auth token not provided'));
      }

      const [method, token] = tokenPayload.split(' ');

      if (method !== 'Bearer') {
        return next(new Error('Invalid authentication method'));
      }

      try {
        socket.user = {};
        // fetch user from Firebase
        return next();
      } catch (error: any) {
        return next(new Error('Authentication error'));
      }
    });

    return server;
  }
}
