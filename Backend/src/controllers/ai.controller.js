import { processTransitChat, processTTS } from '../services/transitIntelligence.js';

export async function postTransitChat(req, res) {
  try {
    const result = await processTransitChat(req.body);
    res.json(result);
  } catch (err) {
    console.error('Error in /api/ai/transit-chat:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function postTTS(req, res) {
  try {
    const result = await processTTS(req.body);
    res.json(result);
  } catch (err) {
    console.error('Error in /api/ai/tts:', err);
    // Graceful fallback — client-side SpeechSynthesis
    res.json({ useClientSynthesis: true, text: req.body?.text || '' });
  }
}