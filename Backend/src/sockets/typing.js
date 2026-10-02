export function registerTyping(io, socket) {
  socket.on('typing',      ({ receiverId }) => io.to(`user_${receiverId}`)
    .emit('user-typing',      { senderId: socket.userId }));
  socket.on('stop-typing', ({ receiverId }) => io.to(`user_${receiverId}`)
    .emit('user-stop-typing', { senderId: socket.userId }));
}