import { Server } from 'socket.io';
import { redisClient } from '../config/redis';

export function setupNotificationWebSocket(io: Server) {
  redisClient.on('message', (channel, message) => {
    if (channel.startsWith('user:')) {
      const userId = channel.split(':')[1];
      io.to(`user-${userId}`).emit('notification', JSON.parse(message));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(`user-${userId}`);
    }

    socket.on('disconnect', () => {
      if (userId) {
        socket.leave(`user-${userId}`);
      }
    });
  });
}
