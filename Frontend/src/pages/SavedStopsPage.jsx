import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Navigation, MapPin } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function SavedStopsPage() {
  const navigate = useNavigate();
  const { savedStops, addSavedStop } = useTransit();
  const [showAddModal, setShowAddModal] = useState(false);
  const [stopName, setStopName] = useState("");
  const [stopId, setStopId] = useState("");

  const handleCreateStop = (e) => {
    e.preventDefault();
    if (!stopName) return;
    addSavedStop({
      name: stopName,
      stopId: stopId ? `#${stopId}` : "#19204",
      walkTime: "6 MIN WALK",
      distance: "450m away",
      isHighlighted: false,
      lines: ["42A Express", "10B Direct"],
      departures: [
        { line: "42A Downtown", eta: "5 mins (Low crowd)", status: "low" },
        { line: "10B Direct Way", eta: "12 mins", status: "normal" }
      ]
    });
    setStopName("");
    setStopId("");
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Saved Transit Stops
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Quick platform references, incoming live boards, and walking durations
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Saved Stop</span>
          </button>
        </div>

        {/* 3 Stop Cards Grid matching Image 8 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mt-6">
          {savedStops.map((stop) => {
            return (
              <div
                key={stop.id}
                className={`bg-white rounded-2xl flex flex-col justify-between transition-all p-5 sm:p-6 shadow-xs ${
                  stop.isHighlighted
                    ? "border-2 border-[#F5B700] ring-1 ring-[#F5B700]/30"
                    : "border border-gray-200/90"
                }`}
              >
                <div>
                  {/* Top: Stop Name, ID and Walk Time */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-950 leading-snug">
                        {stop.name}
                      </h3>
                      <span className="text-[11px] font-mono text-gray-400 font-semibold block mt-0.5">
                        STOP ID: {stop.stopId}
                      </span>
                    </div>

                    <span className="text-[10px] font-extrabold px-2 py-1 rounded-md bg-gray-100 text-gray-700 tracking-wider shrink-0 uppercase">
                      {stop.walkTime}
                    </span>
                  </div>

                  {/* Route Line Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {stop.lines.map((line, lIdx) => (
                      <span
                        key={lIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 border border-gray-200 text-gray-700"
                      >
                        {line}
                      </span>
                    ))}
                  </div>

                  {/* Upcoming Departures section matching Image 8 */}
                  <div className="mt-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
                      UPCOMING DEPARTURES
                    </span>

                    <div className="space-y-2.5 text-xs">
                      {stop.departures.map((dep, dIdx) => (
                        <div key={dIdx} className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">
                            {dep.line}
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              dep.status === "low"
                                ? "text-emerald-600"
                                : dep.status === "delayed"
                                ? "text-amber-600"
                                : dep.status === "high"
                                ? "text-rose-600"
                                : "text-gray-900"
                            }`}
                          >
                            {dep.eta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Distance, Navigate, View Board button matching Image 8 */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 font-mono">
                    {stop.distance}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/search')}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Navigate
                    </button>
                    <button
                      onClick={() => navigate('/track/42A')}
                      className="px-3.5 py-1.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      View Board
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Saved Stop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Add Saved Transit Stop</h3>
            <form onSubmit={handleCreateStop} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Stop Name / Platform</label>
                <input
                  type="text"
                  value={stopName}
                  onChange={(e) => setStopName(e.target.value)}
                  placeholder="e.g. Harbor Plaza - Platform 1"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium focus:outline-hidden focus:border-[#F5B700]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Stop ID (Optional)</label>
                <input
                  type="text"
                  value={stopId}
                  onChange={(e) => setStopId(e.target.value)}
                  placeholder="e.g. 19042"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
