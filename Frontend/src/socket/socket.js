import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const socket = io(BACKEND_URL, {
  withCredentials: true,     // send cookies for auth
  autoConnect: false,        // don't connect until we say so (after login)
  transports: ['websocket'], // force WebSocket (optional but faster)
});

// Dev-only logging so you can see what's happening
if (import.meta.env.DEV) 
{
  socket.on('connect',        () => console.log('🟢 socket connected:', socket.id));
  socket.on('disconnect',     (r) => console.log('🔴 socket disconnected:', r));
  socket.on('connect_error',  (e) => console.error('❌ socket connect_error:', e.message));
}