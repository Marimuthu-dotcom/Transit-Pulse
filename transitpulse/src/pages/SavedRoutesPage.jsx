import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, MapPin, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import CrowdBadge from '../components/CrowdBadge.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function SavedRoutesPage() {
  const navigate = useNavigate();
  const { savedRoutes, deleteSavedRoute, addSavedRoute } = useTransit();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLine, setNewLine] = useState("BUS 10B");

  const handleCreateRoute = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    addSavedRoute({
      busLine: newLine,
      title: newTitle,
      origin: "North Station",
      destination: "State University",
      typicalRide: "28 mins",
      frequency: "4x / week",
      nextEta: "In 10 mins",
      crowdIndex: "Low (20%)",
      crowdStatus: "low",
      alertMessage: "Service running on standard schedule.",
      alertType: "success",
      vehicleId: "10B"
    });
    setNewTitle("");
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
              My Saved Routes
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Monitor real-time updates and delay predictions on your frequent commutes.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Route</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Left Column: Saved Route Cards matching Image 7 */}
          <div className="lg:col-span-8 space-y-6">
            {savedRoutes.map((route) => {
              const isBus42 = route.busLine.includes("42A");
              const isSuccess = route.alertType === "success";

              return (
                <div
                  key={route.id}
                  className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-200">
                        {route.busLine}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900">
                        {route.title}
                      </h3>
                    </div>
                    <Star className="w-4 h-4 fill-[#F5B700] text-[#F5B700]" />
                  </div>

                  {/* Route Stats Grid matching Image 7 */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mt-5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        ORIGIN & DESTINATION
                      </span>
                      <span className="text-gray-900 font-semibold mt-1 block">
                        {route.origin} → {route.destination}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        TYPICAL RIDE
                      </span>
                      <span className="text-gray-900 font-semibold mt-1 block">
                        {route.typicalRide}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        FREQUENCY
                      </span>
                      <span className="text-gray-900 font-semibold mt-1 block">
                        {route.frequency}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        NEXT ETA
                      </span>
                      <span className="text-emerald-600 font-bold font-mono mt-1 block">
                        {route.nextEta}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        CROWD INDEX
                      </span>
                      <div className="mt-1">
                        <CrowdBadge level={route.crowdIndex} />
                      </div>
                    </div>
                  </div>

                  {/* Alert / Status Bar */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      {isSuccess ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                      <span className={isSuccess ? "text-gray-600" : "text-amber-800 font-medium"}>
                        {route.alertMessage}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => navigate(`/search`)}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSavedRoute(route.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate(`/track/${route.vehicleId || '42A'}`)}
                        className="px-4 py-1.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Track Live
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: No Secondary Routes? matching Image 7 */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-950 tracking-tight">
              No Secondary Routes?
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Saving backup routes helps you switch paths instantly if severe delay deviations or extreme crowd bottlenecks affect your main commute.
            </p>

            {/* Dashed placeholder container */}
            <div className="mt-5 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                PLACEHOLDER FOR BACKUP
              </span>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Add an alternate corridor or rapid metro bypass for morning peak hours.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Add Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Add New Saved Route</h3>
            <form onSubmit={handleCreateRoute} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Route Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. University Daily Route"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium focus:outline-hidden focus:border-[#F5B700]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Bus Line</label>
                <select
                  value={newLine}
                  onChange={(e) => setNewLine(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-medium focus:outline-hidden"
                >
                  <option value="BUS 42A">BUS 42A (Express)</option>
                  <option value="BUS 10B">BUS 10B (Direct)</option>
                  <option value="EXPRESS 4">EXPRESS 4 (Shuttle)</option>
                  <option value="METRO LINK">METRO LINK (Rapid)</option>
                </select>
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
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
