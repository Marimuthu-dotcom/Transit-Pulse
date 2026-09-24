import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Star, Search, MapPin, History, Users, Ticket, ArrowRight } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import LiveEtaCountdown from '../components/LiveEtaCountdown.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useTransit();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col relative overflow-hidden">
      <NavBar isDark={false} />

      {/* Subtle background street map watermark */}
      <div className="absolute inset-x-0 bottom-0 h-96 pointer-events-none opacity-[0.03] z-0">
        <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
          <path d="M 0 100 L 1200 100 M 0 300 L 1200 300 M 0 500 L 1200 500 M 200 0 L 200 600 M 500 0 L 500 600 M 800 0 L 800 600" stroke="#000" strokeWidth="20" />
          <circle cx="500" cy="300" r="150" stroke="#000" strokeWidth="15" />
        </svg>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Good morning, {user.nickname?.split(' ')[0] || user.name?.split(' ')[0] || "Alex"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Here is your smart travel rundown for Monday, Sep 30.
            </p>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="self-start sm:self-auto px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-gray-600" />
            <span>Quick Search</span>
          </button>
        </div>

        {/* Amber Service Advisory Banner matching Image 6 */}
        <div className="bg-[#111317] text-white rounded-xl p-3.5 sm:p-4 shadow-sm flex items-center gap-3 mb-6">
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs sm:text-sm text-gray-200">
            <strong className="text-amber-400 font-bold">Service Advisory:</strong> Platform construction at North Station may cause brief 5-10 minute routing delays on Bus 10B. Plan accordingly.
          </p>
        </div>

        {/* Top Grid: Frequent Commute Stop & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Frequent Commute Stop Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Frequent Commute Stop</span>
                </div>
                <button
                  onClick={() => navigate('/stops')}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Edit Saved Stop
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-950">
                    Downtown Central → Office Plaza
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bus Route 42A • platform 2
                  </p>
                </div>

                <div className="text-left sm:text-right flex flex-col sm:items-end gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-500">Live ETA:</span>
                    <LiveEtaCountdown vehicleId="42A" variant="compact" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Low Crowd (10%)</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Departs every 6 mins from Platform 2
              </span>
              <button
                onClick={() => navigate('/track/42A')}
                className="px-4 py-2 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Track Live
              </button>
            </div>
          </div>

          {/* Quick Actions 4 Buttons Grid matching Image 6 */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <button
                onClick={() => navigate('/stops')}
                className="p-3 bg-amber-100/70 hover:bg-amber-100 text-gray-950 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 border border-amber-200 cursor-pointer text-center"
              >
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Saved Stops</span>
              </button>

              <button
                onClick={() => navigate('/history')}
                className="p-3 bg-amber-50 hover:bg-amber-100/80 text-gray-950 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 border border-amber-200/80 cursor-pointer text-center"
              >
                <History className="w-4 h-4 text-amber-800" />
                <span>Trip History</span>
              </button>

              <button
                onClick={() => navigate('/report')}
                className="p-3 bg-amber-100/70 hover:bg-amber-100 text-gray-950 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 border border-amber-200 cursor-pointer text-center"
              >
                <Users className="w-4 h-4 text-amber-800" />
                <span>Crowd Report</span>
              </button>

              <button
                onClick={() => navigate('/routes')}
                className="p-3 bg-amber-50 hover:bg-amber-100/80 text-gray-950 font-bold text-xs rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 border border-amber-200/80 cursor-pointer text-center"
              >
                <Ticket className="w-4 h-4 text-amber-800" />
                <span>My Tickets</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Upcoming Buses Scheduled & Recent Commuted Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Upcoming Buses Scheduled Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-4">
              Upcoming Buses Scheduled
            </h3>

            <div className="divide-y divide-gray-100 text-xs sm:text-sm">
              {/* Row 1: 42A */}
              <div
                onClick={() => navigate('/track/42A')}
                className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-gray-800 w-16">
                    08:15 AM
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-900 text-white">
                    BUS 42A
                  </span>
                  <span className="font-medium text-gray-700">
                    Downtown to Airport
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  On Time
                </span>
              </div>

              {/* Row 2: 10B */}
              <div
                onClick={() => navigate('/track/10B')}
                className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-gray-800 w-16">
                    08:24 AM
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F5B700] text-gray-950">
                    BUS 10B
                  </span>
                  <span className="font-medium text-gray-700">
                    Downtown to State College
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  +5m Delay
                </span>
              </div>

              {/* Row 3: EXP 4 */}
              <div
                onClick={() => navigate('/track/EXP4')}
                className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-gray-800 w-16">
                    08:35 AM
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 border border-gray-300 text-gray-800">
                    EXPRESS 4
                  </span>
                  <span className="font-medium text-gray-700">
                    Downtown to Tech District
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  On Time
                </span>
              </div>
            </div>
          </div>

          {/* Recent Commuted Trips */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                  Recent Commuted Trips
                </h3>
                <button
                  onClick={() => navigate('/history')}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      Downtown → Airport
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Yesterday • Bus 42A
                    </p>
                  </div>
                  <span className="font-mono font-bold text-xs sm:text-sm text-gray-900">
                    $2.75
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      Tech District → Downtown
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Sep 28 • Express 4
                    </p>
                  </div>
                  <span className="font-mono font-bold text-xs sm:text-sm text-gray-900">
                    $4.00
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/history')}
              className="mt-6 w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Export Statement & Logs
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
