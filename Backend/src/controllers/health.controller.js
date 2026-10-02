import { pingDatabase } from '../config/db.js';
import { isGeminiConfigured, isMapsConfigured } from '../config/env.js';

export async function getHealth(req, res) {
  let databaseOk = false;
  let databaseError = null;

  try {
    databaseOk = await pingDatabase();
  } catch (err) {
    databaseError = err.message;
  }

  const healthy = databaseOk;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    service: 'TransitPulse Intelligence Gateway',
    database: {
      connected: databaseOk,
      error: databaseError,
    },
    geminiKeyConfigured: isGeminiConfigured(),
    mapsKeyConfigured: isMapsConfigured(),
  });
}