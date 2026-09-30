import { registerPresence }   from './presence.js';
import { registerTyping }     from './typing.js';
import { registerLiveVoice }  from './liveVoice.js';

export function initSockets(io) {
  io.on('connection', (socket) => 
  {
    console.log('Client connected:', socket.id);
    registerPresence(io, socket);
    registerTyping(io, socket);
    socket.on('disconnect', (reason) =>
    console.log('Client disconnected:', socket.id, '-', reason)
    );
  });

  registerLiveVoice(io.of('/live'));
}