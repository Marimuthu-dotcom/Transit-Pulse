import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, Sparkles, ArrowRight, Activity } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import { popularCorridors } from '../data/mockTransitData.js';
import { useTransit } from '../context/TransitContext.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const { setSearchParams } = useTransit();

  const [origin, setOrigin] = useState("Downtown Central Station");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("Leave Now");

  const handleSearch = (e) => {
    e?.preventDefault();
    setSearchParams((prev) => ({
      ...prev,
      origin: origin || "Downtown Central Station",
      destination: destination || "Airport Terminal 1",
      departTime: departureTime,
    }));
    navigate('/search/results');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col selection:bg-[#F5B700] selection:text-black">
      {/* Dark Theme Top Navigation */}
      <NavBar isDark={true} />

      {/* Hero Transit Map Section */}
      <div className="relative w-full overflow-hidden bg-radial from-[#121929] to-[#0a0d14] pt-8 pb-16 lg:py-16">
        {/* Transit Line SVG Background Graphics */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Golden transit corridor line */}
            <path
              d="M 120 220 L 320 220 C 420 220 460 270 560 270 L 760 270 C 840 270 900 160 1020 160 L 1260 160"
              stroke="#F5B700"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="8 8"
              className="animate-transit-pulse"
            />
            {/* Cyan transit line */}
            <path
              d="M 180 340 L 400 340 C 500 340 560 480 700 480 L 1100 480 C 1180 480 1220 380 1340 380"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Amber bypass branch */}
            <path
              d="M 320 220 C 320 380 400 480 520 480 L 740 480 C 820 480 880 320 980 320 L 1220 580"
              stroke="#f59e0b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* White metro connector */}
            <path
              d="M 280 620 L 420 620 C 500 620 540 520 640 520 L 860 520 C 940 520 1000 640 1120 640 L 1380 640"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />

            {/* Metro Stations Nodes */}
            <g>
              {/* Northern Terminal */}
              <circle cx="1020" cy="160" r="7" fill="#F5B700" />
              <circle cx="1020" cy="160" r="14" stroke="#F5B700" strokeWidth="2" opacity="0.6" />
              
              {/* River Crossing */}
              <circle cx="1220" cy="580" r="7" fill="#F5B700" />
              <circle cx="1220" cy="580" r="14" stroke="#F5B700" strokeWidth="2" opacity="0.6" />

              {/* Civic Center */}
              <circle cx="280" cy="520" r="7" fill="#F5B700" />

              {/* Tech Campus */}
              <circle cx="700" cy="480" r="7" fill="#F5B700" />

              {/* Central Junction */}
              <circle cx="760" cy="270" r="7" fill="#F5B700" />
            </g>
          </svg>
        </div>

        {/* Metro Stations Floating Labels */}
        <div className="absolute top-28 right-16 lg:right-40 text-right hidden sm:block pointer-events-none">
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5B700] animate-ping" />
            <span className="text-sm font-bold text-gray-100">Northern Terminal</span>
          </div>
          <span className="text-[11px] text-gray-400">Northeni Terminal</span>
        </div>

        <div className="absolute bottom-36 left-20 hidden md:block pointer-events-none">
          <div className="text-left">
            <p className="text-sm font-bold text-gray-100">Civic Center</p>
            <p className="text-[11px] text-gray-400">Harbor Plaza</p>
          </div>
        </div>

        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 hidden md:block pointer-events-none">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-100">Tech Campus</p>
            <p className="text-[11px] text-gray-400">River Corridor</p>
          </div>
        </div>

        <div className="absolute bottom-40 right-28 hidden md:block pointer-events-none">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-100">River Crossing</p>
            <p className="text-[11px] text-gray-400">River Crossing Station</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Eyebrow */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              <span>METROPOLITAN AREA</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F5B700]" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE TRACKING ACT2V8</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Headline & Search Box */}
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Know Your Bus. Plan Your Journey.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                Real-time bus location updates, accurate crowd estimates, and seamless multiclass routing across all metropolitan transit corridors.
              </p>

              {/* Floating Dark Search Form Card */}
              <div className="mt-8 bg-[#111622]/90 backdrop-blur-md rounded-2xl border border-gray-700/70 p-3 sm:p-4 shadow-2xl">
                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {/* Departure Point */}
                    <div className="bg-[#182133] rounded-xl border border-gray-700/60 px-3.5 py-2.5 flex flex-col justify-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Departure Point
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                          type="text"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          placeholder="Departure station"
                          className="bg-transparent text-sm font-semibold text-white placeholder-gray-500 focus:outline-hidden w-full"
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="bg-[#182133] rounded-xl border border-gray-700/60 px-3.5 py-2.5 flex flex-col justify-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#F5B700]">
                        Destination
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Navigation className="w-4 h-4 text-[#F5B700] shrink-0" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Enter destination stop"
                          className="bg-transparent text-sm font-semibold text-white placeholder-gray-400 focus:outline-hidden w-full"
                        />
                      </div>
                    </div>

                    {/* Departure Time */}
                    <div className="bg-[#182133] rounded-xl border border-gray-700/60 px-3.5 py-2.5 flex flex-col justify-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Departure Time
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        <select
                          value={departureTime}
                          onChange={(e) => setDepartureTime(e.target.value)}
                          className="bg-transparent text-sm font-semibold text-white focus:outline-hidden w-full cursor-pointer"
                        >
                          <option value="Leave Now" className="bg-[#182133] text-white">Leave Now</option>
                          <option value="In 15 mins" className="bg-[#182133] text-white">In 15 mins</option>
                          <option value="In 30 mins" className="bg-[#182133] text-white">In 30 mins</option>
                          <option value="Select Time..." className="bg-[#182133] text-white">Select Time...</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    type="submit"
                    className="w-full py-3 sm:py-3.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Find My Bus
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Live Pulse Status Card */}
            <div className="lg:col-span-4 self-end">
              <div className="bg-[#111622]/90 backdrop-blur-md rounded-2xl border border-gray-700/70 p-5 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
                  <Activity className="w-4 h-4 text-[#F5B700]" />
                  <h3 className="text-sm font-bold text-gray-200">Live Pulse Status</h3>
                </div>
                <div className="space-y-3.5 mt-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Fleet</span>
                    <span className="font-mono font-bold text-white">2,492 Buses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg Delay Deviation</span>
                    <span className="font-mono font-bold text-emerald-400">+1.4 mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Commuter Satisfaction</span>
                    <span className="font-mono font-bold text-white">96.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 Big Metrics */}
          <div className="mt-14 pt-8 border-t border-gray-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">2,400+</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Buses Active Right Now</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">98.7%</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Real Time Schedule Accuracy</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">150K+</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Daily Active Riders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Corridors Section (Matches bottom of Image 1) */}
      <div className="bg-white text-gray-900 py-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Popular Corridors
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Frequent commuter routes with live connection entinses
              </p>
            </div>
            <Link
              to="/routes"
              className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#e0a600] flex items-center gap-1 transition-colors"
            >
              <span>View All Routes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Corridor Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCorridors.map((c) => {
              const badgeBg =
                c.badgeType === "dark"
                  ? "bg-gray-900 text-white"
                  : c.badgeType === "yellow"
                  ? "bg-[#F5B700] text-gray-950"
                  : c.badgeType === "metro"
                  ? "bg-slate-900 text-cyan-300"
                  : "bg-white border border-gray-300 text-gray-900";

              const crowdDot =
                c.crowdStatus === "low"
                  ? "bg-emerald-500"
                  : c.crowdStatus === "medium"
                  ? "bg-amber-500"
                  : "bg-rose-500";

              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/track/${c.id.includes("42") ? "42A" : c.id.includes("10") ? "10B" : "EXP4"}`)}
                  className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${badgeBg}`}>
                        {c.busLine}
                      </span>
                      <span className="text-xs font-semibold text-gray-800">
                        {c.frequency}
                      </span>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm font-bold text-gray-900">
                        {c.origin}
                      </h4>
                      <p className="text-xs text-gray-500">
                        to {c.destination}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">
                      Next bus in: <strong className="text-gray-900">{c.nextBusIn}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-700 text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${crowdDot}`} />
                      <span>{c.crowdLevel}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
