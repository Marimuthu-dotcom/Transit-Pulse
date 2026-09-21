import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Calendar, ChevronDown, Clock, Plane, GraduationCap, Building2, Landmark } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import { searchHubs, recentSearches } from '../data/mockTransitData.js';
import { useTransit } from '../context/TransitContext.jsx';

export default function SearchFormPage() {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useTransit();

  const [origin, setOrigin] = useState(searchParams.origin || "Downtown Central Station");
  const [destination, setDestination] = useState("Airport Terminal 1 (International)");
  const [destInput, setDestInput] = useState("Airpl");
  const [showDropdown, setShowDropdown] = useState(true);
  const [preference, setPreference] = useState("Fastest Route");
  const [departDate, setDepartDate] = useState("Today");

  const autocompleteOptions = [
    { title: "Airport Terminal 1 (International)", full: "Airport Terminal 1 (International)" },
    { title: "Airport Regional Business Plaza", full: "Airport Regional Business Plaza" }
  ];

  const handleSelectDest = (dest) => {
    setDestination(dest);
    setDestInput(dest);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setSearchParams({
      origin,
      destination: destination || destInput || "Airport Terminal 1",
      preference,
      departDate,
      departTime: "Leave Now"
    });
    navigate('/search/results');
  };

  const getHubIcon = (iconName) => {
    switch (iconName) {
      case 'plane':
        return <Plane className="w-5 h-5" />;
      case 'graduation-cap':
        return <GraduationCap className="w-5 h-5" />;
      case 'building':
        return <Building2 className="w-5 h-5" />;
      case 'landmark':
        return <Landmark className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getHubBadgeColor = (color) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'green':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'amber':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'red':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Search Form */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Where are you heading?
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter travel details to fetch live schedules and vehicle options.
            </p>

            <div className="mt-6 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-7 shadow-xs">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Origin Station */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Origin Station
                  </label>
                  <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-300 transition-all bg-white">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mr-2.5" />
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Origin station or stop"
                      className="w-full text-sm font-semibold text-gray-900 focus:outline-hidden bg-transparent"
                    />
                  </div>
                </div>

                {/* Destination with Autocomplete */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Destination
                  </label>
                  <div className="relative flex items-center border border-gray-300 rounded-xl px-3.5 py-3 focus-within:border-[#F5B700] focus-within:ring-1 focus-within:ring-[#F5B700] transition-all bg-white">
                    <Navigation className="w-4 h-4 text-gray-400 shrink-0 mr-2.5" />
                    <input
                      type="text"
                      value={destInput}
                      onChange={(e) => {
                        setDestInput(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Destination stop or landmark"
                      className="w-full text-sm font-semibold text-gray-900 focus:outline-hidden bg-transparent"
                    />
                  </div>

                  {/* Autocomplete Dropdown matching Image 2 */}
                  {showDropdown && (
                    <div className="mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-md divide-y divide-gray-100 overflow-hidden z-20">
                      {autocompleteOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectDest(opt.full)}
                          className={`px-4 py-3 text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2 ${
                            idx === 0
                              ? "bg-amber-50/70 text-gray-900 border-l-4 border-l-[#F5B700]"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Navigation className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{opt.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preferences & Depart Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Preference
                    </label>
                    <div className="relative border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white">
                      <select
                        value={preference}
                        onChange={(e) => setPreference(e.target.value)}
                        className="w-full text-sm font-semibold text-gray-900 bg-transparent focus:outline-hidden appearance-none cursor-pointer pr-6"
                      >
                        <option value="Fastest Route">Fastest Route</option>
                        <option value="Lowest Crowd">Lowest Crowd</option>
                        <option value="Fewest Transfers">Fewest Transfers</option>
                        <option value="Cheapest Fare">Cheapest Fare</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Depart Date
                    </label>
                    <div className="relative border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white flex items-center justify-between">
                      <input
                        type="text"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full text-sm font-semibold text-gray-900 bg-transparent focus:outline-hidden"
                      />
                      <Calendar className="w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-extrabold text-sm rounded-xl transition-colors shadow-xs active:scale-[0.99] cursor-pointer"
                  >
                    Search Live Schedules
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Recent Searches & Popular Hubs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Recent Searches */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Recent Searches
              </h2>
              <div className="bg-white rounded-xl border border-gray-200/90 divide-y divide-gray-100 overflow-hidden shadow-xs">
                {recentSearches.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setOrigin(item.origin);
                      setDestination(item.destination);
                      setDestInput(item.destination);
                      setSearchParams((prev) => ({
                        ...prev,
                        origin: item.origin,
                        destination: item.destination
                      }));
                      navigate('/search/results');
                    }}
                    className="p-3.5 hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                      <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                      <span>{item.origin}</span>
                      <span className="text-[#F5B700]">→</span>
                      <span>{item.destination}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700">
                      {item.busLine}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Hubs */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Popular Hubs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {searchHubs.map((hub) => (
                  <div
                    key={hub.id}
                    onClick={() => {
                      setDestination(hub.name);
                      setDestInput(hub.name);
                      setShowDropdown(false);
                    }}
                    className="bg-white p-3.5 rounded-xl border border-gray-200/90 hover:border-gray-300 hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${getHubBadgeColor(hub.color)}`}>
                      {getHubIcon(hub.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">
                        {hub.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                        {hub.routesActive}
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
