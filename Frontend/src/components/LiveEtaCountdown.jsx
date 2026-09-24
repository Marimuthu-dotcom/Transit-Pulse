import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  Radio,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  MapPin,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Bus
} from 'lucide-react';

/**
 * Client-side fallback generator if backend network is unreachable
 */
function getClientSimulatedArrival(vehicleId = '42A') {
  const norm = String(vehicleId).toUpperCase().replace('BUS ', '').trim();
  const presets = {
    '42A': {
      seconds: 165,
      nextStop: '4th Avenue Boulevard',
      destination: 'Airport Terminal 1',
      status: 'ON TIME',
      statusType: 'success',
      isLiveGps: true,
      currentSpeed: 44,
      crowdPercent: 15,
      stops: [
        { name: '4th Avenue Boulevard', secondsRemaining: 165 },
        { name: 'Airport Business Park', secondsRemaining: 710 },
        { name: 'Airport Terminal 1', secondsRemaining: 1420 },
      ],
    },
    '101': {
      seconds: 450,
      nextStop: 'Palayamkottai Bus Terminal',
      destination: 'Tirunelveli New Bus Stand',
      status: 'ON TIME (NH138 EXPRESSWAY)',
      statusType: 'success',
      isLiveGps: true,
      currentSpeed: 56,
      crowdPercent: 38,
      stops: [
        { name: 'Seithunganallur Flyover', secondsRemaining: 55 },
        { name: 'Palayamkottai Bus Terminal', secondsRemaining: 450 },
        { name: 'Tirunelveli New Bus Stand', secondsRemaining: 1300 },
      ],
    },
    '10B': {
      seconds: 335,
      nextStop: 'Held at Junction 8',
      destination: 'State University campus',
      status: 'MINOR DELAY (+2m Traffic)',
      statusType: 'warning',
      isLiveGps: true,
      currentSpeed: 32,
      crowdPercent: 48,
      stops: [
        { name: 'Held at Junction 8', secondsRemaining: 335 },
        { name: 'Civic Library', secondsRemaining: 950 },
        { name: 'State University campus', secondsRemaining: 1720 },
      ],
    },
    'EXP4': {
      seconds: 520,
      nextStop: 'Metro Toll Gate Gate A',
      destination: 'Business Tech District',
      status: 'CROWD CONGESTION (+4m)',
      statusType: 'danger',
      isLiveGps: true,
      currentSpeed: 52,
      crowdPercent: 82,
      stops: [
        { name: 'Metro Toll Gate Gate A', secondsRemaining: 520 },
        { name: 'Tech District Terminal A', secondsRemaining: 1060 },
        { name: 'Business Tech District', secondsRemaining: 1900 },
      ],
    },
    '108': {
      seconds: 2080,
      nextStop: 'Thoothukudi Old Bus Stand',
      destination: 'Tirunelveli New Bus Stand',
      status: 'SCHEDULED (NO LIVE GPS)',
      statusType: 'neutral',
      isLiveGps: false,
      currentSpeed: 0,
      crowdPercent: 20,
      stops: [
        { name: 'Thoothukudi Old Bus Stand', secondsRemaining: 2080 },
        { name: 'Tirunelveli New Bus Stand', secondsRemaining: 4780 },
      ],
    },
    '77': {
      seconds: 0,
      nextStop: 'Hillside Junction',
      destination: 'Hillside Junction',
      status: 'OFFLINE / NO RECENT GPS',
      statusType: 'danger',
      isLiveGps: false,
      currentSpeed: 0,
      crowdPercent: 0,
      stops: [],
    },
  };

  const selected = presets[norm] || {
    seconds: 290,
    nextStop: 'Next Urban Platform',
    destination: 'Downtown Hub',
    status: 'IN TRANSIT',
    statusType: 'success',
    isLiveGps: true,
    currentSpeed: 40,
    crowdPercent: 30,
    stops: [{ name: 'Next Urban Platform', secondsRemaining: 290 }],
  };

  return {
    vehicleId: norm,
    nextStopName: selected.nextStop,
    destination: selected.destination,
    secondsRemaining: selected.seconds,
    status: selected.status,
    statusType: selected.statusType,
    isLiveGps: selected.isLiveGps,
    currentSpeed: selected.currentSpeed,
    crowdPercent: selected.crowdPercent,
    stops: selected.stops,
    lastUpdated: new Date().toISOString(),
    source: selected.isLiveGps ? 'Simulated Live GPS Feed' : 'Published Timetable Schedule',
  };
}

export default function LiveEtaCountdown({
  vehicleId = '42A',
  variant = 'card', // 'card', 'compact', 'hero', 'badge'
  showTimeline = true,
  showControls = true,
  onArrival,
  className = '',
}) {
  const [telemetry, setTelemetry] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [tickTock, setTickTock] = useState(false);
  const [error, setError] = useState(null);

  const initialTotalSecondsRef = useRef(300);
  const arrivalFiredRef = useRef(false);

  // Fetch simulated bus arrival times from backend API or fallback
  const fetchArrivalTimes = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsSyncing(true);
      setError(null);

      try {
        const res = await fetch(`/api/transit/live-eta?vehicleId=${encodeURIComponent(vehicleId)}`);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const data = await res.json();
        setTelemetry(data);
        setSecondsLeft(data.secondsRemaining);
        initialTotalSecondsRef.current = Math.max(data.secondsRemaining, 60);
        arrivalFiredRef.current = false;
      } catch (err) {
        console.warn('Backend live-eta API fetch failed, using client simulated telemetry:', err.message);
        // Fallback to client-side simulated generator
        const fallback = getClientSimulatedArrival(vehicleId);
        setTelemetry(fallback);
        setSecondsLeft(fallback.secondsRemaining);
        initialTotalSecondsRef.current = Math.max(fallback.secondsRemaining, 60);
        arrivalFiredRef.current = false;
      } finally {
        if (showLoading) {
          setTimeout(() => setIsSyncing(false), 300);
        }
      }
    },
    [vehicleId]
  );

  // Initial fetch and on vehicleId change
  useEffect(() => {
    fetchArrivalTimes(true);
  }, [fetchArrivalTimes]);

  // React-based interval timer updating every 1000ms (1 second)
  useEffect(() => {
    if (isPaused || secondsLeft === null || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (!arrivalFiredRef.current) {
            arrivalFiredRef.current = true;
            if (onArrival) onArrival(vehicleId);
          }
          return 0;
        }
        return prev - 1;
      });

      // Toggle visual tick pulse every second
      setTickTock((t) => !t);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, secondsLeft, vehicleId, onArrival]);

  // Periodic resync (every 60s) to simulate subtle satellite corrections
  useEffect(() => {
    const resyncInterval = setInterval(() => {
      if (!isPaused && secondsLeft !== null && secondsLeft > 5) {
        fetchArrivalTimes(false);
      }
    }, 60000);
    return () => clearInterval(resyncInterval);
  }, [fetchArrivalTimes, isPaused, secondsLeft]);

  // Formatting helpers
  const formatTime = (totalSec) => {
    if (totalSec === null || totalSec === undefined) return { mins: '--', secs: '--', full: '--:--' };
    if (totalSec <= 0) return { mins: '00', secs: '00', full: '00:00' };

    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (hours > 0) {
      return {
        hours: pad(hours),
        mins: pad(mins),
        secs: pad(secs),
        full: `${pad(hours)}:${pad(mins)}:${pad(secs)}`,
      };
    }

    return {
      hours: null,
      mins: pad(mins),
      secs: pad(secs),
      full: `${pad(mins)}:${pad(secs)}`,
    };
  };

  const timeFormatted = formatTime(secondsLeft);
  const isOffline = telemetry && !telemetry.isLiveGps && telemetry.secondsRemaining === 0;
  const isArrived = secondsLeft === 0 && !isOffline;

  // Calculate percentage of arrival segment remaining
  const progressPercent =
    secondsLeft !== null && initialTotalSecondsRef.current > 0
      ? Math.max(5, Math.min(100, 100 - Math.round((secondsLeft / initialTotalSecondsRef.current) * 100)))
      : 50;

  // 1. COMPACT VARIANT (for table rows, bus cards, search results)
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#121824] border border-gray-700/80 font-mono shadow-xs ${className}`}
        role="timer"
        aria-live="polite"
      >
        <span
          className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
            isOffline
              ? 'bg-rose-500'
              : isArrived
              ? 'bg-emerald-400 animate-ping'
              : tickTock
              ? 'bg-[#F5B700]'
              : 'bg-[#F5B700]/40'
          }`}
        />
        <span className="text-xs font-bold text-white tracking-tight">
          {isOffline ? (
            <span className="text-rose-400 font-sans text-[11px]">SIGNAL LOST</span>
          ) : isArrived ? (
            <span className="text-emerald-400 font-sans font-extrabold text-[11px]">ARRIVING NOW</span>
          ) : (
            <>
              <span className="text-[#F5B700]">{timeFormatted.mins}</span>
              <span className="text-gray-400 animate-pulse">:</span>
              <span className="text-white">{timeFormatted.secs}</span>
            </>
          )}
        </span>
        {isSyncing && <RefreshCw className="w-3 h-3 text-[#F5B700] animate-spin shrink-0" />}
      </div>
    );
  }

  // 2. BADGE VARIANT (minimalist pill)
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-mono tracking-tight shadow-md ${
          isOffline
            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
            : isArrived
            ? 'bg-emerald-500 text-black animate-pulse'
            : 'bg-[#F5B700] text-gray-950'
        } ${className}`}
      >
        <Clock className="w-3.5 h-3.5 shrink-0" />
        {isOffline ? (
          'NO GPS'
        ) : isArrived ? (
          'AT PLATFORM'
        ) : (
          <span>
            {timeFormatted.mins}:{timeFormatted.secs}
          </span>
        )}
      </div>
    );
  }

  // 3. HERO & CARD VARIANTS (full interactive telemetry dashboard widget)
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        variant === 'hero'
          ? 'bg-gradient-to-b from-[#161f30] to-[#0e1420] border-amber-500/30 p-5 sm:p-6 shadow-2xl'
          : 'bg-[#161c28] border-gray-700/80 p-4 sm:p-5 shadow-xl'
      } ${className}`}
      role="timer"
      aria-live="polite"
    >
      {/* Background glowing ambient light */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#F5B700]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header: Next Stop & Telemetry Status */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#121824] border border-gray-700 flex items-center justify-center text-[#F5B700]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block">
              LIVE ETA TELEMETRY
            </span>
            <span className="text-xs font-semibold text-gray-200 truncate max-w-[180px] sm:max-w-xs block">
              {telemetry?.nextStopName || 'Loading stop...'}
            </span>
          </div>
        </div>

        {/* Telemetry Status Chip */}
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isOffline
                ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                : telemetry?.isLiveGps
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                : 'bg-amber-950/80 text-amber-400 border border-amber-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOffline ? 'bg-rose-400' : telemetry?.isLiveGps ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {isOffline ? 'OFFLINE' : telemetry?.isLiveGps ? 'LIVE GPS' : 'TIMETABLE'}
          </span>

          {/* Sync / Refresh Button */}
          {showControls && (
            <button
              type="button"
              onClick={() => fetchArrivalTimes(true)}
              disabled={isSyncing}
              title="Resync with live satellite telemetry"
              className="p-1 rounded-lg bg-[#121824] hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#F5B700]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="my-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            ESTIMATED ARRIVAL IN
          </span>

          {isOffline ? (
            <div className="flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <div>
                <span className="text-xl font-bold font-mono">SIGNAL LOST</span>
                <p className="text-[11px] text-gray-400">Telemetry transponder offline (48m+)</p>
              </div>
            </div>
          ) : isArrived ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div>
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
                  ARRIVING NOW
                </span>
                <p className="text-xs text-emerald-300/90 font-medium">Bus is pulling up to the platform</p>
              </div>
            </div>
          ) : (
            /* Digital Stopwatch Display with glowing seconds tick */
            <div className="flex items-baseline gap-1.5 font-mono select-none">
              {timeFormatted.hours && (
                <>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {timeFormatted.hours}
                    </span>
                    <span className="text-[9px] text-gray-500 uppercase font-sans font-semibold">Hours</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#F5B700] mx-0.5 animate-pulse">:</span>
                </>
              )}

              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-black text-[#F5B700] tracking-tight drop-shadow-sm">
                  {timeFormatted.mins}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-sans font-semibold mt-0.5">Mins</span>
              </div>

              <span className={`text-3xl sm:text-5xl font-black transition-opacity duration-200 mx-0.5 ${
                tickTock ? 'text-[#F5B700]' : 'text-gray-600'
              }`}>
                :
              </span>

              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {timeFormatted.secs}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-sans font-semibold mt-0.5">Secs</span>
              </div>

              {/* Real-time seconds heartbeat ticker */}
              <div className="ml-3 hidden sm:flex flex-col items-start text-left">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span>1s Real-time Tick</span>
                </span>
                <span className="text-[10px] text-gray-400 font-sans">
                  {telemetry?.currentSpeed ? `${telemetry.currentSpeed} km/h speed` : 'GPS synchronized'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Speed / Delay / Schedule pill */}
        <div className="text-left sm:text-right">
          <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block">
            SCHEDULE STATUS
          </span>
          <span
            className={`inline-block mt-1 font-bold text-xs sm:text-sm ${
              telemetry?.statusType === 'danger'
                ? 'text-rose-400'
                : telemetry?.statusType === 'warning'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {telemetry?.status || 'ON TIME'}
          </span>
          <span className="block text-[10px] text-gray-400 font-mono mt-0.5">
            Dest: {telemetry?.destination || 'Terminal'}
          </span>
        </div>
      </div>

      {/* Segment Progress Bar */}
      {!isOffline && (
        <div className="mt-3 pt-3 border-t border-gray-700/60">
          <div className="flex justify-between text-[11px] font-semibold text-gray-400 mb-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#F5B700]" />
              <span>Approach to {telemetry?.nextStopName || 'Platform'}</span>
            </span>
            <span className="text-white font-mono">{progressPercent}% approached</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isArrived
                  ? 'bg-emerald-400'
                  : 'bg-gradient-to-r from-amber-500 via-[#F5B700] to-yellow-300'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Upcoming Stops Timeline preview (optional) */}
      {showTimeline && telemetry?.stops && telemetry.stops.length > 1 && (
        <div className="mt-4 pt-3 border-t border-gray-700/50">
          <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block mb-2">
            UPCOMING STOPS IN TRANSIT
          </span>
          <div className="space-y-1.5">
            {telemetry.stops.slice(0, 3).map((stop, idx) => {
              const stopSeconds = Math.max(0, stop.secondsRemaining - (initialTotalSecondsRef.current - (secondsLeft || 0)));
              const formatted = formatTime(stopSeconds);

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-[#0e131d]/60 border border-gray-800/80"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700]" />
                    <span className="text-gray-300 truncate">{stop.name}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#F5B700] shrink-0">
                    {stopSeconds <= 0 ? 'Now' : `in ${formatted.mins}m ${formatted.secs}s`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom controls: Pause / Play toggle & Sync status */}
      {showControls && (
        <div className="mt-4 pt-2.5 border-t border-gray-700/40 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#121824] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
              <span>{isPaused ? 'Resume Timer' : 'Pause Timer'}</span>
            </button>
            <span className="text-gray-500">•</span>
            <span>{isPaused ? 'Timer paused' : 'Updating every 1 sec'}</span>
          </div>

          <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
            Source: {telemetry?.source || 'Satellite API'}
          </span>
        </div>
      )}
    </div>
  );
}
