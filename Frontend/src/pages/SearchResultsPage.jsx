import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight, Filter, SlidersHorizontal } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import BusCard from '../components/BusCard.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const { buses, searchParams } = useTransit();

  const busList = Object.values(buses);

  const handleCompare = (bus) => {
    navigate('/search/compare');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight flex items-center gap-2">
              <span>{searchParams.origin || "Downtown Station"}</span>
              <span className="text-[#F5B700]">→</span>
              <span>{searchParams.destination || "Airport Terminal 1"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Departure Scheduled for {searchParams.departDate || "Today"} • 2 Filters Applied
            </p>
          </div>

          {/* Filter Pills matching Image 3 */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#F5B700] text-gray-950 font-bold text-xs shadow-xs">
              Fastest First
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold text-xs shadow-xs">
              Bus Type: Express
            </span>
          </div>
        </div>

        {/* Best Match Recommendation Banner */}
        <div className="mt-6 bg-white rounded-xl border border-amber-200/90 p-4 sm:p-4.5 shadow-xs flex items-start sm:items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#F5B700] flex items-center justify-center shrink-0 text-gray-950 font-bold shadow-xs">
            <Star className="w-5 h-5 fill-black text-black" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Best Match Recommendation
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">
              Bus 42A departs in 8 mins from Platform 4, it has the lowest crowd index (12%) and hits zero transit bottlenecks.
            </p>
          </div>
        </div>

        {/* Bus List Cards */}
        <div className="mt-6 space-y-3.5">
          {busList.map((bus) => (
            <BusCard
              key={bus.vehicleId}
              bus={bus}
              onCompare={handleCompare}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
