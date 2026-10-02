import { io } from 'socket.io-client';

export const socket = io({
  withCredentials: true,     // send cookies for auth
  autoConnect: false,        // don't connect until we say so (after login)
});

// Dev-only logging so you can see what's happening
if (import.meta.env.DEV) 
{
  socket.on('connect',        () => console.log('🟢 socket connected:', socket.id));
  socket.on('disconnect',     (r) => console.log('🔴 socket disconnected:', r));
  socket.on('connect_error',  (e) => console.error('❌ socket connect_error:', e.message));
}