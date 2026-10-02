import { getLiveEtaData } from '../services/transitIntelligence.js';

export function getLiveEta(req, res) {
  try {
    const vehicleId = req.query.vehicleId || '42A';
    res.json(getLiveEtaData(vehicleId));
  } catch (err) {
    console.error('Error in /api/transit/live-eta:', err);
    res.status(500).json({ error: err.message });
  }
}