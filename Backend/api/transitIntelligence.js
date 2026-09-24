import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let aiClient = null;
export function getGenAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export const TRANSIT_ASSISTANT_SYSTEM_PROMPT = `
You are the TransitPulse Voice and Commuter Intelligence Assistant.
You provide riders with real-time transit status, route recommendations, crowd assessments, and journey advice.

RULES:
1. Ground Truth First: Rely on the provided transit dataset.
   - If a bus is CONFIRMED LIVE GPS (e.g. Bus 101, Bus 42A, Bus 10B, Bus EXP4), report its verified coordinates, live speed, next stop, and crowd index.
   - If a bus is SCHEDULED without active GPS telemetry (e.g. Bus 108), explicitly inform the commuter: "Bus 108 is scheduled according to the published timetable, but real-time satellite GPS telemetry is currently not transmitting."
   - If a bus is OFFLINE or has lost signal (e.g. Bus 77), say: "Your selected bus has no recent GPS update. I cannot confirm its current location. You can check the last reported position or choose another available bus such as Bus 101 or Bus 42A."
   - NEVER invent or hallucinate bus locations, speeds, or crowd levels.
2. Route Knowledge:
   - For Thoothukudi to Tirunelveli:
     - Recommend Bus 101 Superfast Express (Live GPS, ~52 mins, 38% crowd, stops at Palayamkottai, currently on NH138).
     - Bus 108 is a scheduled non-stop alternative (departs in ~35 mins, 45 mins journey).
   - For Central Metro City:
     - Recommend Bus 42A Express for Airport trips (Live GPS, 15% crowd, departs every 6 mins).
     - Bus 10B is running with minor delays (held at Junction 8, 48% crowd).
     - Express 4 has very high crowd warnings (82% capacity).
3. Return JSON Structure:
   Always return a JSON object with:
   - "spokenText": A concise, natural, friendly spoken message suitable for speech synthesis (1-3 sentences).
   - "text": Detailed markdown explanation with clear bullet points, ETA, and crowd breakdown.
   - "action": Optional object if the user asked to track, search, or view a route:
     - { "type": "TRACK_BUS", "vehicleId": "101" }
     - { "type": "SEARCH_ROUTE", "origin": "Thoothukudi", "destination": "Tirunelveli" }
     - { "type": "FILTER_CORRIDOR", "corridor": "intercity" | "metro" }
     - { "type": "SHOW_STOPS" }
     - null if general question
`;

export async function processTransitChat(body) {
  const { message, transitContext = {} } = body;
  if (!message || typeof message !== 'string') {
    throw new Error('Message text is required');
  }

  const ai = getGenAI();

  // Rule-based fallback if no Gemini key
  if (!ai) {
    const lower = message.toLowerCase();

    if (lower.includes('thoothukudi') || lower.includes('tirunelveli') || lower.includes('101') || lower.includes('108')) {
      if (lower.includes('108')) {
        return {
          spokenText: "Bus 108 is a scheduled non-stop service to Tirunelveli. Note that live GPS telemetry is currently not broadcasting; it is timetabled to depart in 35 minutes.",
          text: "**Bus 108 Deluxe Non-Stop**\n- **Status:** Timetabled / Scheduled Estimate (No Live GPS transponder signal)\n- **Next Departure:** in 35 mins from Thoothukudi Bus Stand Bay 4\n- **Estimated Duration:** 45 mins\n- **Alternative:** Bus 101 has active live GPS and departs in 7 mins.",
          action: { type: 'TRACK_BUS', vehicleId: '108' }
        };
      }
      return {
        spokenText: "For travel from Thoothukudi to Tirunelveli, take Bus 101 Superfast Express. It has confirmed live GPS tracking, moderate crowd at 38%, and is currently passing Seithunganallur.",
        text: "### Recommendation: Bus 101 Superfast Express\n- **Verified GPS Telemetry:** Active satellite beacon broadcasting on NH138.\n- **Current Location:** Passing Seithunganallur Flyover at 56 km/h.\n- **ETA to Tirunelveli:** ~22 minutes (Arriving ~11:16 AM).\n- **Crowd Index:** 38% capacity (comfortable seat availability).\n- **Fare:** ₹38.00\n- **Next Stop:** Palayamkottai Bus Terminal (8 mins).",
        action: { type: 'TRACK_BUS', vehicleId: '101' }
      };
    }

    if (lower.includes('77') || lower.includes('offline')) {
      return {
        spokenText: "Bus 77 has no recent GPS update and its current location cannot be confirmed. I recommend taking Bus 101 or Bus 42A instead.",
        text: "⚠️ **Bus 77 Status: Telemetry Offline**\n- **Signal State:** No GPS signal received in the last 48 minutes.\n- **Location:** Unconfirmed (Last depot ping 48m ago).\n- **Commuter Advisory:** Do not rely on scheduled arrival times for this vehicle until transponder signal re-establishes.",
        action: { type: 'TRACK_BUS', vehicleId: '77' }
      };
    }

    if (lower.includes('crowd') || lower.includes('crowded')) {
      return {
        spokenText: "Bus 42A has the lowest crowd index at 15% capacity. Bus 101 is at 38%, while Express 4 has a crowd advisory at 82% capacity.",
        text: "### Real-Time Crowd Telemetry\n- **Bus 42A Express:** Low (15% capacity) — Green rating\n- **Bus 101 Superfast:** Moderate (38% capacity) — Seated comfort\n- **Bus 10B Direct:** Moderate (48% capacity) — Minor delay\n- **Express 4 Shuttle:** High (82% capacity) — Standing room only",
        action: null
      };
    }

    if (lower.includes('where') || lower.includes('track') || lower.includes('42a') || lower.includes('airport')) {
      return {
        spokenText: "Bus 42A is actively in-transit passing 4th Avenue Boulevard at 44 km/h with low crowd, arriving at Airport Terminal 1 in 24 minutes.",
        text: "### Bus 42A Express — Live Position\n- **GPS Status:** Confirmed Live Telemetry\n- **Speed:** 44 km/h\n- **Location:** Passing 4th Avenue Block\n- **ETA Next Stop:** 3 mins (4th Ave)\n- **Terminal Arrival:** 24 mins",
        action: { type: 'TRACK_BUS', vehicleId: '42A' }
      };
    }

    return {
      spokenText: "I'm TransitPulse AI. You can ask me to track any bus, check crowd levels, or find routes such as Thoothukudi to Tirunelveli.",
      text: "I can help you with:\n- **Find Buses:** *\"Which bus should I take from Thoothukudi to Tirunelveli?\"*\n- **Live Tracking:** *\"Where is Bus 101 now?\"* or *\"Track Bus 42A\"*\n- **Crowd Levels:** *\"Is the next bus crowded?\"*\n- **Nearest Stops:** *\"Show me nearby transit stops\"*",
      action: null
    };
  }

  // Model-driven Gemini 3.8 Flash query
  const prompt = `
User Question: "${message}"

Current Application Context:
- Active Vehicle: ${transitContext.activeVehicleId || 'None'}
- Available Fleet: ${JSON.stringify(transitContext.busesSummary || [])}

Please respond strictly in JSON matching the schema:
{
  "spokenText": string,
  "text": string,
  "action": { "type": string, "vehicleId"?: string, "origin"?: string, "destination"?: string } | null
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: TRANSIT_ASSISTANT_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
    },
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (err) {
    return {
      spokenText: response.text.substring(0, 180),
      text: response.text,
      action: null,
    };
  }
}

export async function processTTS(body) {
  const { text } = body;
  if (!text) throw new Error('Text is required');

  const ai = getGenAI();
  if (!ai) {
    return { useClientSynthesis: true, text };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text }] }],
      config: {
        responseMimeType: 'audio/mp3',
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
      return {
        audioBase64: part.inlineData.data,
        mimeType: part.inlineData.mimeType || 'audio/mp3',
      };
    }
  } catch (e) {
    console.warn('Gemini TTS preview fallback to client speech:', e.message);
  }

  return { useClientSynthesis: true, text };
}

// Simulated real-time bus arrival telemetry engine
export function getLiveEtaData(vehicleId = '42A') {
  const normId = String(vehicleId).toUpperCase().replace('BUS ', '').trim();

  // Dynamic slight jitter so consecutive fetches simulate live updates
  const jitter = Math.floor(Math.random() * 8) - 4;

  const simulatedVehicles = {
    '42A': {
      vehicleId: '42A',
      name: 'Bus 42A Express',
      nextStopName: '4th Avenue Boulevard',
      destination: 'Airport Terminal 1',
      baseSeconds: 175,
      crowdPercent: 15,
      crowdLevel: 'Low (15% capacity)',
      status: 'ON TIME',
      statusType: 'success',
      isLiveGps: true,
      currentSpeed: 44,
      totalJourneyMinutes: 24,
      stops: [
        { name: '4th Avenue Boulevard', secondsRemaining: 175 },
        { name: 'Airport Business Park', secondsRemaining: 720 },
        { name: 'Airport Terminal 1', secondsRemaining: 1440 },
      ],
    },
    '101': {
      vehicleId: '101',
      name: 'Bus 101 Superfast Express',
      nextStopName: 'Palayamkottai Bus Terminal',
      destination: 'Tirunelveli New Bus Stand',
      baseSeconds: 465,
      crowdPercent: 38,
      crowdLevel: 'Moderate (38% capacity)',
      status: 'ON TIME (NH138 EXPRESSWAY)',
      statusType: 'success',
      isLiveGps: true,
      currentSpeed: 56,
      totalJourneyMinutes: 52,
      stops: [
        { name: 'Seithunganallur Flyover', secondsRemaining: 60 },
        { name: 'Palayamkottai Bus Terminal', secondsRemaining: 465 },
        { name: 'Tirunelveli New Bus Stand', secondsRemaining: 1320 },
      ],
    },
    '10B': {
      vehicleId: '10B',
      name: 'Bus 10B Direct',
      nextStopName: 'Held at Junction 8',
      destination: 'State University campus',
      baseSeconds: 345,
      crowdPercent: 48,
      crowdLevel: 'Moderate (48% capacity)',
      status: 'MINOR DELAY (+2m Traffic)',
      statusType: 'warning',
      isLiveGps: true,
      currentSpeed: 32,
      totalJourneyMinutes: 29,
      stops: [
        { name: 'Held at Junction 8', secondsRemaining: 345 },
        { name: 'Civic Library', secondsRemaining: 960 },
        { name: 'State University campus', secondsRemaining: 1740 },
      ],
    },
    'EXP4': {
      vehicleId: 'EXP4',
      name: 'Express 4 Shuttle',
      nextStopName: 'Metro Toll Gate Gate A',
      destination: 'Business Tech District',
      baseSeconds: 530,
      crowdPercent: 82,
      crowdLevel: 'Very High (82% capacity)',
      status: 'CROWD CONGESTION (+4m)',
      statusType: 'danger',
      isLiveGps: true,
      currentSpeed: 52,
      totalJourneyMinutes: 32,
      stops: [
        { name: 'Metro Toll Gate Gate A', secondsRemaining: 530 },
        { name: 'Tech District Terminal A', secondsRemaining: 1080 },
        { name: 'Business Tech District', secondsRemaining: 1920 },
      ],
    },
    '108': {
      vehicleId: '108',
      name: 'Bus 108 Deluxe Non-Stop',
      nextStopName: 'Thoothukudi Old Bus Stand',
      destination: 'Tirunelveli New Bus Stand',
      baseSeconds: 2100,
      crowdPercent: 20,
      crowdLevel: 'Scheduled Timetable Normal',
      status: 'SCHEDULED (NO LIVE GPS TELEMETRY)',
      statusType: 'neutral',
      isLiveGps: false,
      currentSpeed: 0,
      totalJourneyMinutes: 45,
      stops: [
        { name: 'Thoothukudi Old Bus Stand (Departure)', secondsRemaining: 2100 },
        { name: 'Tirunelveli New Bus Stand', secondsRemaining: 4800 },
      ],
    },
    '77': {
      vehicleId: '77',
      name: 'Bus 77 Regional Feeder',
      nextStopName: 'Hillside Junction',
      destination: 'Hillside Junction',
      baseSeconds: 0,
      crowdPercent: 0,
      crowdLevel: 'Signal Lost / Unavailable',
      status: 'OFFLINE / NO GPS SIGNAL',
      statusType: 'danger',
      isLiveGps: false,
      currentSpeed: 0,
      totalJourneyMinutes: 38,
      stops: [],
    },
  };

  const v = simulatedVehicles[normId] || {
    vehicleId: normId,
    name: `Bus ${normId}`,
    nextStopName: 'Upcoming City Stop',
    destination: 'Central Terminal',
    baseSeconds: 300,
    crowdPercent: 25,
    crowdLevel: 'Normal',
    status: 'IN TRANSIT',
    statusType: 'success',
    isLiveGps: true,
    currentSpeed: 38,
    totalJourneyMinutes: 20,
    stops: [{ name: 'Upcoming City Stop', secondsRemaining: 300 }],
  };

  const finalSeconds = Math.max(0, v.baseSeconds + (v.baseSeconds > 0 ? jitter : 0));

  return {
    vehicleId: v.vehicleId,
    name: v.name,
    nextStopName: v.nextStopName,
    destination: v.destination,
    secondsRemaining: finalSeconds,
    crowdPercent: v.crowdPercent,
    crowdLevel: v.crowdLevel,
    status: v.status,
    statusType: v.statusType,
    isLiveGps: v.isLiveGps,
    currentSpeed: v.currentSpeed,
    totalJourneyMinutes: v.totalJourneyMinutes,
    stops: v.stops.map((s, idx) => ({
      ...s,
      secondsRemaining: Math.max(0, s.secondsRemaining + jitter * (idx + 1)),
    })),
    lastUpdated: new Date().toISOString(),
    source: v.isLiveGps ? 'Live Satellite GPS Feed' : 'Published Timetable Model',
  };
}

