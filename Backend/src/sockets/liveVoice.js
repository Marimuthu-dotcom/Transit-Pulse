import {
  getGenAI,
  TRANSIT_ASSISTANT_SYSTEM_PROMPT,
} from '../services/transitIntelligence.js';

export function registerLiveVoice(namespace) {
  namespace.on('connection', async (socket) => {
    const ai = getGenAI();
    if (!ai) {
      socket.emit('live:error', { message: 'Gemini API Key is not configured.' });
      return socket.disconnect(true);
    }

    let session;
    try {
      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          systemInstruction: TRANSIT_ASSISTANT_SYSTEM_PROMPT,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
        },
        callbacks: {
          onmessage: (msg) => {
            const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) socket.emit('live:audio', { audio });
            if (msg.serverContent?.interrupted) socket.emit('live:interrupted');
          },
          onclose: () => socket.emit('live:closed'),
        },
      });
    } catch (err) {
      console.error('Live connect error:', err);
      return socket.emit('live:error', { message: err.message });
    }

    socket.on('live:audio', ({ audio }) => {
      try {
        session.sendRealtimeInput({
          audio: { data: audio, mimeType: 'audio/pcm;rate=16000' },
        });
      } catch (e) { console.error('live:audio error:', e); }
    });

    socket.on('disconnect', () => { try { session.close(); } catch (_) {} });
  });
}