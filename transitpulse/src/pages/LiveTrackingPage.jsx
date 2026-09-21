import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Minus,
  Layers,
  Navigation,
  Bus,
  AlertCircle,
  Mic,
  Sparkles,
  MapPin,
  Radio,
  Clock,
  Compass,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Volume2
} from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import TransitGoogleMap from '../components/TransitGoogleMap.jsx';
import TransitVoiceAssistant from '../components/TransitVoiceAssistant.jsx';
import LiveEtaCountdown from '../components/LiveEtaCountdown.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function LiveTrackingPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { buses, savedStops } = useTransit();

  const activeId = vehicleId || "42A";
  const bus = buses[activeId] || buses["42A"] || Object.values(buses)[0];

  const [mapMode, setMapMode] = useState('google'); // 'google' or 'vector'
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [busPositionOffset, setBusPositionOffset] = useState({ x: 0, y: 0 });

  // Subtle real-time bus motion simulation for vector view
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPositionOffset((prev) => ({
        x: Math.sin(Date.now() / 3000) * 8,
        y: Math.cos(Date.now() / 3000) * 8,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectVehicle = (id) => {
    navigate(`/track/${id}`);
  };

  const isLiveGPS = bus.isLiveConfirmed !== false;
  const isScheduledOnly = bus.isLiveConfirmed === false && bus.status?.includes('SCHEDULED');
  const isOffline = bus.isLiveConfirmed === false && (bus.status?.includes('OFFLINE') || bus.status?.includes('NO RECENT'));

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col selection:bg-[#F5B700] selection:text-black">
      <NavBar isDark={true} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col">
        
        {/* Top Corridor & Vehicle Quick Switcher Strip */}
        <div className="mb-4 bg-[#0e131d] p-2.5 sm:p-3 rounded-2xl border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-[#F5B700]" /> Fleet:
            </span>

            {Object.values(buses).map((b) => {
              const isSelected = b.vehicleId === activeId;
              const isLive = b.isLiveConfirmed !== false;

              return (
                <button
                  key={b.vehicleId}
                  onClick={() => handleSelectVehicle(b.vehicleId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#F5B700] text-black shadow-lg ring-2 ring-[#F5B700]/30'
                      : 'bg-[#121824] text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700/60'
                  }`}
                >
                  <span>{b.vehicleId}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-[10px] opacity-75 font-normal">
                    {b.vehicleId === '101' ? 'Thoothukudi' : b.vehicleId === '108' ? 'Direct' : b.vehicleId === '42A' ? 'Airport' : ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Map Mode & AI Voice Assistant Launcher */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Map Mode Selector */}
            <div className="flex items-center bg-[#121824] p-1 rounded-xl border border-gray-700/70">
              <button
                type="button"
                onClick={() => setMapMode('google')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mapMode === 'google'
                    ? 'bg-[#F5B700] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Google Maps
              </button>
              <button
                type="button"
                onClick={() => setMapMode('vector')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mapMode === 'vector'
                    ? 'bg-[#F5B700] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Schematic View
              </button>
            </div>

            {/* Voice Assistant Launcher */}
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#F5B700] text-black font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
            </button>
          </div>
        </div>

        {/* Telemetry Status Advisory Banner */}
        {!isLiveGPS && (
          <div className={`mb-4 p-3 rounded-xl border flex items-center justify-between text-xs ${
            isOffline
              ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
              : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 shrink-0 ${isOffline ? 'text-rose-400' : 'text-amber-400'}`} />
              <span>
                <strong>Commuter Notice: </strong>
                {isOffline
                  ? 'Bus 77 telemetry has been silent for over 48 mins. Its exact live GPS position cannot be verified. Check published schedule or consider Bus 101/42A.'
                  : 'Bus 108 departure times are calculated from the published timetable. Live GPS beacon is currently not broadcasting.'}
              </span>
            </div>
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="text-[11px] underline font-bold hover:text-white shrink-0 ml-2"
            >
              Ask AI Alternatives →
            </button>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
          
          {/* Left Column: Interactive Transit Map */}
          <div className="lg:col-span-8 bg-[#0e131d] rounded-2xl border border-gray-800 relative overflow-hidden flex flex-col min-h-[520px] lg:min-h-[660px] shadow-2xl">
            
            {/* Map Header Overlay */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
              <div className="bg-[#121824]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-700/80 shadow-lg">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-gray-100 uppercase">
                    {activeId === '101' || activeId === '108'
                      ? 'THOOTHUKUDI ↔ TIRUNELVELI CORRIDOR'
                      : 'LIVE TRANSIT MAP - METRO CORRIDOR'}
                  </h2>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isLiveGPS
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {isLiveGPS ? 'LIVE SATELLITE GPS' : 'TIMETABLE ESTIMATE'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  TRACKING BUS {activeId} | <span className="text-[#F5B700] font-bold">{bus.name}</span> | SPEED: {bus.speed} km/h
                </p>
              </div>
            </div>

            {/* Interactive Map View */}
            {mapMode === 'google' ? (
              <TransitGoogleMap
                buses={buses}
                activeVehicleId={activeId}
                onSelectVehicle={handleSelectVehicle}
                stops={savedStops}
                className="w-full h-full flex-1"
                height="100%"
              />
            ) : (
              /* High-Fidelity Vector Schematic Diagram */
              <div className="relative w-full h-full flex-1 overflow-hidden bg-[#0a0d14]">
                <svg
                  className="w-full h-full transition-transform duration-500"
                  viewBox="0 0 800 600"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <defs>
                    <pattern id="city-blocks" width="80" height="80" patternUnits="userSpaceOnUse">
                      <rect x="5" y="5" width="70" height="70" fill="#121824" rx="4" />
                      <rect x="12" y="12" width="24" height="24" fill="#182030" rx="2" />
                      <rect x="44" y="12" width="24" height="24" fill="#182030" rx="2" />
                      <rect x="12" y="44" width="24" height="24" fill="#182030" rx="2" />
                      <rect x="44" y="44" width="24" height="24" fill="#182030" rx="2" />
                    </pattern>

                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <rect width="800" height="600" fill="url(#city-blocks)" opacity="0.85" />

                  {/* Secondary Street Road Network */}
                  <g stroke="#2a3447" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 50 120 L 750 120" />
                    <path d="M 50 280 L 750 280" />
                    <path d="M 50 440 L 750 440" />
                    <path d="M 160 50 L 160 550" />
                    <path d="M 320 50 L 320 550" />
                    <path d="M 480 50 L 480 550" />
                    <path d="M 640 50 L 640 550" />
                    <path d="M 80 80 L 380 380 L 720 380" />
                  </g>

                  {/* Regional Highway / Metro Line */}
                  <path
                    d="M 120 500 L 260 380 L 440 280 L 680 140"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeDasharray="6 6"
                    fill="none"
                  />

                  {/* PRIMARY TRANSIT ROUTE (Glowing Yellow Line) */}
                  <path
                    d="M 140 180 L 260 280 L 260 440 L 420 440 L 420 280 L 580 280 L 580 440 L 700 500"
                    stroke="#F5B700"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#glow)"
                  />
                  <path
                    d="M 140 180 L 260 280 L 260 440 L 420 440 L 420 280 L 580 280 L 580 440 L 700 500"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Station Nodes */}
                  <g fill="#0e131d" stroke="#F5B700" strokeWidth="3">
                    <circle cx="140" cy="180" r="7" />
                    <circle cx="260" cy="280" r="7" />
                    <circle cx="260" cy="440" r="7" />
                    <circle cx="420" cy="440" r="7" />
                    <circle cx="420" cy="280" r="7" />
                    <circle cx="580" cy="280" r="7" />
                    <circle cx="580" cy="440" r="7" />
                    <circle cx="700" cy="500" r="7" />
                  </g>

                  {/* Station Labels */}
                  <g fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                    <rect x="80" y="135" width="140" height="24" rx="4" fill="#121824" stroke="#475569" strokeWidth="1" />
                    <text x="90" y="151" fill="#F5B700">{activeId === '101' ? 'Thoothukudi Old' : 'Central Station'}</text>

                    <rect x="330" y="455" width="90" height="18" rx="3" fill="#121824" opacity="0.9" />
                    <text x="340" y="468" fill="#e2e8f0">{activeId === '101' ? 'Seithunganallur' : 'DOWNTOWN'}</text>

                    <rect x="490" y="325" width="90" height="18" rx="3" fill="#121824" opacity="0.9" />
                    <text x="495" y="338" fill="#cbd5e1">{activeId === '101' ? 'Palayamkottai' : 'Tech District'}</text>

                    <rect x="595" y="390" width="110" height="18" rx="3" fill="#121824" opacity="0.9" />
                    <text x="605" y="403" fill="#cbd5e1">{activeId === '101' ? 'Tirunelveli New' : 'Airport Terminal'}</text>
                  </g>

                  {/* LIVE BUS VEHICLE MARKER */}
                  <g
                    transform={`translate(${bus.coordinates?.x || 380 + busPositionOffset.x}, ${bus.coordinates?.y || 440 + busPositionOffset.y})`}
                    className="transition-transform duration-1000 ease-out"
                  >
                    {isLiveGPS && (
                      <circle cx="0" cy="0" r="24" fill="#F5B700" opacity="0.25" className="animate-ping" />
                    )}
                    <circle cx="0" cy="0" r="14" fill="#F5B700" opacity="0.4" />
                    
                    <rect x="-42" y="-12" width="84" height="24" rx="6" fill="#F5B700" stroke="#000000" strokeWidth="1.5" />
                    <text x="-34" y="4" fill="#000000" fontSize="10" fontWeight="900" fontFamily="sans-serif">
                      {bus.name.length > 12 ? `Bus ${bus.vehicleId}` : bus.name}
                    </text>
                  </g>
                </svg>

                {/* Map Zoom Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-1.5 z-20">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
                    className="w-8 h-8 rounded-lg bg-[#121824]/90 border border-gray-700 text-white flex items-center justify-center hover:bg-[#1a2333] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
                    className="w-8 h-8 rounded-lg bg-[#121824]/90 border border-gray-700 text-white flex items-center justify-center hover:bg-[#1a2333] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Vehicle Tracking Details Panel */}
          <div className="lg:col-span-4 bg-[#111622] rounded-2xl border border-gray-800 p-5 sm:p-6 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Header Status & Speed */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  isLiveGPS
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                    : isOffline
                    ? 'bg-rose-950/80 border border-rose-500/40 text-rose-400'
                    : 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isLiveGPS ? 'bg-emerald-400 animate-pulse' : isOffline ? 'bg-rose-400' : 'bg-amber-400'}`} />
                  <span>{bus.status || "LIVE IN-TRANSIT"}</span>
                </div>
                <span className="text-xs font-mono font-semibold text-gray-400">
                  Speed: <strong className="text-white font-bold">{bus.speed} {bus.speedUnit || "km/h"}</strong>
                </span>
              </div>

              {/* Title & Driver */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    {bus.name}
                  </h2>
                  <span className="text-xs font-bold text-[#F5B700] bg-[#1a2233] px-2 py-0.5 rounded border border-gray-700">
                    {bus.fare || '$2.75'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Driver: <span className="text-gray-200 font-semibold">{bus.driverName} (ID: {bus.driverId})</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Corridor: <span className="text-[#F5B700] font-semibold">{bus.corridorName}</span>
                </p>
              </div>

              {/* AI Recommendation Box if available */}
              {bus.recommendationReason && (
                <div className="mt-4 p-3 rounded-xl bg-[#161f30] border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5B700] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">AI Commuter Intelligence</strong>
                    <span>{bus.recommendationReason}</span>
                  </div>
                </div>
              )}

              {/* Live Real-Time ETA Countdown Component (Updates every 1s using React Timer) */}
              <div className="mt-4">
                <LiveEtaCountdown
                  vehicleId={bus.vehicleId || bus.id}
                  variant="card"
                  showTimeline={true}
                  showControls={true}
                />
              </div>

              {/* Route Schedule & Stops list */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Route Schedule & Stops
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {bus.stops?.length || 0} Scheduled Points
                  </span>
                </div>

                <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700">
                  {bus.stops?.map((stop, idx) => {
                    const isPassed = stop.status === "passed";
                    const isActive = stop.status === "active";

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                          isActive
                            ? "bg-[#182133] border border-gray-700 font-bold"
                            : "hover:bg-gray-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isPassed
                                ? "bg-gray-600"
                                : isActive
                                ? "bg-[#F5B700] ring-4 ring-[#F5B700]/20"
                                : "border-2 border-gray-500"
                            }`}
                          />
                          <span className={isPassed ? "text-gray-500 line-through" : isActive ? "text-white" : "text-gray-300"}>
                            {stop.name}
                          </span>
                        </div>

                        <span
                          className={`font-mono text-[11px] ${
                            isPassed
                              ? "text-gray-500 font-normal"
                              : isActive
                              ? "text-[#F5B700] font-bold"
                              : "text-gray-400"
                          }`}
                        >
                          {stop.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-gray-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsVoiceOpen(true)}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-[#F5B700] text-black text-xs font-bold rounded-xl transition-all hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Assistant</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/report')}
                className="py-2.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Report Crowd
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Floating TransitPulse Voice Assistant Dialog */}
      <TransitVoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        activeVehicleId={activeId}
        onActionTrigger={(actionType, targetId) => {
          if (actionType === 'TRACK_BUS') {
            navigate(`/track/${targetId}`);
          }
        }}
      />
    </div>
  );
}
