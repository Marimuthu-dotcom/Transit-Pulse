import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function CompareRoutesPage() {
  const navigate = useNavigate();
  const { buses, searchParams } = useTransit();

  const options = [
    {
      bus: buses["42A"],
      isRecommended: true,
      recBadge: "RECOMMENDED BEST MATCH",
      subtitle: "Green Route Corridor",
      subtitleColor: "text-emerald-600",
      eta: "8 mins",
      etaColor: "text-emerald-600",
      crowd: "Low (15%)",
      crowdColor: "text-emerald-600",
      duration: "24 mins",
      stops: "8 stops",
      fare: "$2.75",
      btnText: "Select Bus 42A",
      isPrimaryBtn: true,
    },
    {
      bus: buses["10B"],
      isRecommended: false,
      recBadge: null,
      subtitle: "Standard Direct Path",
      subtitleColor: "text-gray-500",
      eta: "14 mins",
      etaColor: "text-amber-600",
      crowd: "Medium (48%)",
      crowdColor: "text-amber-600",
      duration: "29 mins",
      stops: "11 stops",
      fare: "$2.75",
      btnText: "Select Bus 10B",
      isPrimaryBtn: false,
    },
    {
      bus: buses["EXP4"],
      isRecommended: false,
      recBadge: null,
      subtitle: "Suburban Shuttle Corridor",
      subtitleColor: "text-gray-500",
      eta: "21 mins",
      etaColor: "text-rose-600",
      crowd: "High (82%)",
      crowdColor: "text-rose-600",
      duration: "32 mins",
      stops: "6 stops",
      fare: "$4.00",
      btnText: "Select Express 4",
      isPrimaryBtn: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Compare Live Options
          </h1>
          <p className="text-sm font-semibold text-gray-600 mt-1">
            {searchParams.origin || "Downtown Station"} → {searchParams.destination || "Airport Terminal 1"}
          </p>
        </div>

        {/* 3 Side-by-Side Comparison Cards matching Image 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {options.map((opt, idx) => {
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl flex flex-col justify-between transition-all ${
                  opt.isRecommended
                    ? "border-2 border-[#F5B700] shadow-sm relative pt-4 pb-6 px-6"
                    : "border border-gray-200/90 shadow-xs pt-4 pb-6 px-6"
                }`}
              >
                <div>
                  {/* Recommended Badge */}
                  <div className="h-6 mb-2">
                    {opt.recBadge ? (
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                        {opt.recBadge}
                      </span>
                    ) : (
                      <div className="h-4" />
                    )}
                  </div>

                  {/* Bus Title & Subtitle */}
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    {opt.bus.name}
                  </h3>
                  <p className={`text-xs font-semibold mt-0.5 ${opt.subtitleColor}`}>
                    {opt.subtitle}
                  </p>

                  {/* Attributes comparison table */}
                  <div className="mt-6 space-y-4 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">ETA Countdown</span>
                      <span className={`font-mono font-bold ${opt.etaColor}`}>{opt.eta}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Crowd Level</span>
                      <span className={`font-semibold ${opt.crowdColor}`}>{opt.crowd}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Journey Duration</span>
                      <span className="font-semibold text-gray-900">{opt.duration}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Active Stops</span>
                      <span className="font-semibold text-gray-900">{opt.stops}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Fare Price</span>
                      <span className="font-mono font-bold text-gray-900">{opt.fare}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-8">
                  {opt.isPrimaryBtn ? (
                    <button
                      onClick={() => navigate(`/track/${opt.bus.vehicleId}`)}
                      className="w-full py-3 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-sm rounded-xl transition-colors shadow-xs active:scale-[0.99] cursor-pointer"
                    >
                      {opt.btnText}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/track/${opt.bus.vehicleId}`)}
                      className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold text-sm rounded-xl transition-colors active:scale-[0.99] cursor-pointer"
                    >
                      {opt.btnText}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
