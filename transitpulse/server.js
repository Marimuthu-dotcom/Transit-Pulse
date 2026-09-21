import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import {
  processTransitChat,
  processTTS,
  getLiveEtaData,
  getGenAI,
  TRANSIT_ASSISTANT_SYSTEM_PROMPT,
} from './api/transitIntelligence.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TransitPulse Intelligence Gateway',
      geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
      mapsKeyConfigured: Boolean(process.env.VITE_GOOGLE_MAPS_API_KEY),
    });
  });

  // Simulated live bus arrival telemetry
  app.get('/api/transit/live-eta', (req, res) => {
    try {
      const vehicleId = req.query.vehicleId || '42A';
      const data = getLiveEtaData(vehicleId);
      res.json(data);
    } catch (err) {
      console.error('Error in /api/transit/live-eta:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Transit Assistant Chat & Reasoning API
  app.post('/api/ai/transit-chat', async (req, res) => {
    try {
      const result = await processTransitChat(req.body);
      return res.json(result);
    } catch (err) {
      console.error('Error in /api/ai/transit-chat:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Text-To-Speech endpoint
  app.post('/api/ai/tts', async (req, res) => {
    try {
      const result = await processTTS(req.body);
      return res.json(result);
    } catch (err) {
      console.error('Error in /api/ai/tts:', err);
      return res.json({ useClientSynthesis: true, text: req.body?.text || '' });
    }
  });

  // Set up WebSocket server on /api/live for Gemini Live API
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
    if (pathname === '/api/live' || pathname === '/ws/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs) => {
    console.log('Client connected to TransitPulse Live Voice Socket');
    const ai = getGenAI();

    if (!ai) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          message: 'Gemini API Key is not configured on the server. Please check the Secrets panel.',
        })
      );
      clientWs.close();
      return;
    }

    try {
      // Connect to Gemini 3.8 Live API
      const liveSession = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          systemInstruction: TRANSIT_ASSISTANT_SYSTEM_PROMPT,
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
        callbacks: {
          onmessage: (msg) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              clientWs.send(JSON.stringify({ type: 'audio', audio: audioData }));
            }
            if (msg.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ type: 'closed' }));
            }
          },
        },
      });

      clientWs.on('message', (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          if (parsed.audio) {
            liveSession.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          }
        } catch (e) {
          console.error('Error handling live message:', e);
        }
      });

      clientWs.on('close', () => {
        try {
          liveSession.close();
        } catch (e) {}
      });
    } catch (err) {
      console.error('Live connect error:', err);
      clientWs.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`TransitPulse Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start TransitPulse server:', err);
  process.exit(1);
});
