import db from '../config/db.js';

const onlineUsers = new Map();
export const getOnlineUsers = () => onlineUsers;

export function registerPresence(io, socket) {
  socket.on('join-room', async (userId) => {
    socket.join(`user_${userId}`);
    socket.userId = userId;

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    if (onlineUsers.get(userId).size === 1) {
      try {
        await db.promise().query(
          `UPDATE users SET is_online = TRUE WHERE id = ?`, [userId]
        );
      } catch (e) { console.error('presence join DB error:', e); }
      io.emit('user-online', { userId: Number(userId) });
    }
  });

  socket.on('disconnect', async () => {
    const userId = socket.userId;
    if (!userId || !onlineUsers.has(userId)) return;
    onlineUsers.get(userId).delete(socket.id);

    if (onlineUsers.get(userId).size === 0) {
      onlineUsers.delete(userId);
      try {
        await db.promise().query(
          `UPDATE users SET is_online = FALSE, last_seen = NOW() WHERE id = ?`,
          [userId]
        );
      } catch (e) { console.error('presence leave DB error:', e); }
      io.emit('user-offline', { userId: Number(userId), last_seen: new Date() });
    }
  });
}