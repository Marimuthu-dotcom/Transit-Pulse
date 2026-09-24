import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Users,
  Award,
  Flame,
  Plane,
  ShieldCheck,
  Check,
  Thermometer,
  Sparkles,
  Accessibility
} from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function ReportCrowdPage() {
  const navigate = useNavigate();
  const { user, leaderboard, badges, submitCrowdReport } = useTransit();

  const [busRoute, setBusRoute] = useState("Bus 42A");
  const [selectedCrowd, setSelectedCrowd] = useState(1); // "Few Seats" selected in Image 9
  const [acStatus, setAcStatus] = useState("Pleasant Temp");
  const [cleanliness, setCleanliness] = useState("Very Clean");
  const [accessibility, setAccessibility] = useState("Ramp Operational");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const crowdLevels = [
    { id: 0, label: "Empty", desc: "Plenty of space", percent: 5, category: "low", icon: "smile" },
    { id: 1, label: "Few Seats", desc: "Some seats free", percent: 25, category: "low", icon: "user-check" },
    { id: 2, label: "Standing Room", desc: "No seats left", percent: 60, category: "medium", icon: "user-minus" },
    { id: 3, label: "Crowded", desc: "Tight standing", percent: 85, category: "high", icon: "users" },
    { id: 4, label: "Packed", desc: "Full capacity", percent: 98, category: "high", icon: "x-circle" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    submitCrowdReport({
      busLine: busRoute,
      crowdOption: crowdLevels[selectedCrowd],
      details: { acStatus, cleanliness, accessibility }
    });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      navigate('/dashboard');
    }, 1500);
  };

  const getBadgeIcon = (name) => {
    switch (name) {
      case 'award':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'plane':
        return <Plane className="w-4 h-4 text-amber-500" />;
      case 'shield-check':
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      default:
        return <Award className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Report Crowd Level
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Help fellow commuters plan better trips with instant live updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Multi-step Reporting Form matching Image 9 */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Select Your Bus Route */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#F5B700] text-gray-950 font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm font-bold text-gray-900">
                    Select Your Bus Route
                  </h2>
                </div>

                {/* Input with Search Icon */}
                <div className="relative flex items-center border border-gray-300 rounded-xl px-3.5 py-3 focus-within:border-[#F5B700] focus-within:ring-1 focus-within:ring-[#F5B700] transition-all bg-white">
                  <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={busRoute}
                    onChange={(e) => setBusRoute(e.target.value)}
                    placeholder="Search bus line or corridor"
                    className="w-full text-sm font-semibold text-gray-900 focus:outline-hidden bg-transparent"
                  />
                </div>

                {/* Recent Rides Pills matching Image 9 */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    RECENT RIDES
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setBusRoute("Bus 42A")}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        busRoute === "Bus 42A"
                          ? "bg-amber-50/70 border-[#F5B700] ring-1 ring-[#F5B700]"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F5B700] text-gray-950 mr-1.5">
                          BUS 42A
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          Downtown Central → International Airport
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                        Ridden 12 mins ago
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBusRoute("Bus 10B")}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        busRoute === "Bus 10B"
                          ? "bg-amber-50/70 border-[#F5B700] ring-1 ring-[#F5B700]"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 mr-1.5">
                          BUS 10B
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          North Station → State University
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                        Ridden 2 hours ago
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: How crowded is it? (5 density cards) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#F5B700] text-gray-950 font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm font-bold text-gray-900">
                    How crowded is it?
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {crowdLevels.map((lvl) => {
                    const isSelected = selectedCrowd === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setSelectedCrowd(lvl.id)}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-gray-900 block leading-tight">
                          {lvl.label}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {lvl.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Optional Details (Optional) matching Image 9 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#F5B700] text-gray-950 font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-gray-900">
                    Optional Details (Optional)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/60">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      AC / TEMPERATURE
                    </span>
                    <select
                      value={acStatus}
                      onChange={(e) => setAcStatus(e.target.value)}
                      className="mt-1 w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Pleasant Temp">Pleasant Temp</option>
                      <option value="Warm / Humid">Warm / Humid</option>
                      <option value="Very Cold">Very Cold</option>
                    </select>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/60">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      VEHICLE CLEANLINESS
                    </span>
                    <select
                      value={cleanliness}
                      onChange={(e) => setCleanliness(e.target.value)}
                      className="mt-1 w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Very Clean">Very Clean</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Needs Cleaning">Needs Cleaning</option>
                    </select>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/60">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      ACCESSIBILITY STATUS
                    </span>
                    <select
                      value={accessibility}
                      onChange={(e) => setAccessibility(e.target.value)}
                      className="mt-1 w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                    >
                      <option value="Ramp Operational">Ramp Operational</option>
                      <option value="Wheelchair Bay Occupied">Wheelchair Bay Occupied</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Row matching Image 9 */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Ready to submit! Thank you for helping.</span>
                </span>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {submittedSuccess ? "Report Submitted!" : "Submit Live Report"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Rider Impact, Weekly Leaderboard & Badges matching Image 9 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Rider Impact Active Card (Dark Card) */}
            <div className="bg-[#111622] rounded-2xl p-5 text-white shadow-md border border-gray-800">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#F5B700]"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white">
                      Rider Impact Active
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      {user.nickname || user.name}
                    </p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-300 italic leading-relaxed">
                "Your reports helped {user.stats.ridersHelpedToday} riders today avoid heavily crowded buses on corridors."
              </p>
            </div>

            {/* Weekly Leaderboard matching Image 9 */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Weekly Leaderboard
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold text-[10px] border border-amber-200 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                  <span>5-Day Streak</span>
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {leaderboard.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      item.isCurrent
                        ? "bg-amber-50/80 border border-amber-200 font-bold text-gray-950"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 font-mono text-[11px] text-gray-500">
                        {item.rank}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-gray-900">
                      {item.reports} Reports
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unlocked Badges matching Image 9 */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Unlocked Badges
              </h3>

              <div className="space-y-3 text-xs">
                {badges.map((b) => (
                  <div key={b.id} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-amber-100/70 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      {getBadgeIcon(b.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
