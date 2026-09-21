import React, { useState } from 'react';
import { User, Check, Settings, Shield, Accessibility, ChevronDown } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function ProfileSettingsPage() {
  const { user, updateUserProfile, updatePreferences } = useTransit();

  const [activeTab, setActiveTab] = useState("profile");
  const [nickname, setNickname] = useState(user.nickname || "Alex Mercer");
  const [phone, setPhone] = useState(user.phone || "+1 (555) 382-9021");
  const [radius, setRadius] = useState(user.preferences.stationSearchRadius || "500 meters");
  const [crowdLimit, setCrowdLimit] = useState(user.preferences.preferredMaxCrowdIndex || "Medium (< 50% capacity)");

  const [urgentAlerts, setUrgentAlerts] = useState(user.preferences.urgentServiceDisruptions ?? true);
  const [delayAlerts, setDelayAlerts] = useState(user.preferences.minorCorridorDelayAdvisories ?? true);
  const [proximityAlerts, setProximityAlerts] = useState(user.preferences.platformProximityWarnings ?? false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({ nickname, phone });
    updatePreferences({
      stationSearchRadius: radius,
      preferredMaxCrowdIndex: crowdLimit,
      urgentServiceDisruptions: urgentAlerts,
      minorCorridorDelayAdvisories: delayAlerts,
      platformProximityWarnings: proximityAlerts,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    setNickname(user.nickname || "Alex Mercer");
    setPhone(user.phone || "+1 (555) 382-9021");
    setRadius("500 meters");
    setCrowdLimit("Medium (< 50% capacity)");
    setUrgentAlerts(true);
    setDelayAlerts(true);
    setProximityAlerts(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="pb-6 border-b border-gray-200/80 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Rider Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Configure personal commuter preferences, safety limits, and custom notification triggers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Card matching Image 12 */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs">
            {/* User Avatar & Info */}
            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-[#F5B700] shadow-sm"
              />
              <h2 className="mt-3 text-lg font-bold text-gray-900">
                {user.name}
              </h2>
              <p className="text-xs text-gray-400">
                {user.email}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                <Check className="w-3 h-3 text-emerald-500" />
                <span>Premium Lifetime Rider</span>
              </div>
            </div>

            {/* Rider Stats */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Member Since</span>
                <span className="font-semibold text-gray-800">{user.memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Saved Corridors</span>
                <span className="font-semibold text-gray-800">{user.savedCorridorsCount} Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Daily Commute</span>
                <span className="font-semibold text-gray-800 font-mono">{user.avgDailyCommute}</span>
              </div>
            </div>

            {/* Vertical Tab Navigation matching Image 12 */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-1">
              {[
                { id: "profile", label: "Rider Profile" },
                { id: "system", label: "System Preferences" },
                { id: "privacy", label: "Privacy & Security" },
                { id: "accessibility", label: "Accessibility Tools" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-amber-50 text-gray-950 font-bold border border-amber-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Preferences & Alert Settings matching Image 12 */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Account & Custom Preferences */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Account & Custom Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      RIDER NICKNAME
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      REGISTERED PHONE
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      STATION SEARCH RADIUS
                    </label>
                    <div className="relative border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white">
                      <select
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-hidden appearance-none cursor-pointer pr-6"
                      >
                        <option value="300 meters">300 meters</option>
                        <option value="500 meters">500 meters</option>
                        <option value="1000 meters">1000 meters</option>
                        <option value="2000 meters">2000 meters</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      PREFERRED MAX CROWD INDEX
                    </label>
                    <div className="relative border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white">
                      <select
                        value={crowdLimit}
                        onChange={(e) => setCrowdLimit(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-hidden appearance-none cursor-pointer pr-6"
                      >
                        <option value="Low (< 25% capacity)">Low (&lt; 25% capacity)</option>
                        <option value="Medium (< 50% capacity)">Medium (&lt; 50% capacity)</option>
                        <option value="High (< 80% capacity)">High (&lt; 80% capacity)</option>
                        <option value="No Limit">No Limit</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Alert Settings matching Image 12 */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Live Alert Settings
                </h3>

                <div className="space-y-4">
                  {/* Urgent Disruptions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                        Urgent Service Disruptions
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Critical platform modifications, heavy line bottlenecks, active weather re-routings
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUrgentAlerts(!urgentAlerts)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        urgentAlerts ? "bg-[#F5B700]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          urgentAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Minor Corridor Delays */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                        Minor Corridor Delay Advisories
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Alert when a saved route vehicle experiences +5 min delay deviations
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDelayAlerts(!delayAlerts)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        delayAlerts ? "bg-[#F5B700]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          delayAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Platform Proximity Warnings */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                        Platform Proximity Warnings
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Alert when your saved bus line is under 4 minutes from arrival stop
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProximityAlerts(!proximityAlerts)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        proximityAlerts ? "bg-[#F5B700]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          proximityAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons matching Image 12 */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Reset Changes
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {savedSuccess ? "Settings Saved!" : "Save Settings"}
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
