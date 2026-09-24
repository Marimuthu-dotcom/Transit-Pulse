import React from 'react';
import { useNavigate } from 'react-router-dom';
import CrowdBadge from './CrowdBadge.jsx';
import LiveEtaCountdown from './LiveEtaCountdown.jsx';

export default function BusCard({ bus, onCompare }) {
  const navigate = useNavigate();

  const getBadgeStyle = (badgeColor) => {
    switch (badgeColor) {
      case 'green':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'red':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Col 1: Bus Name & Badge */}
        <div className="min-w-[140px]">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {bus.name}
          </h3>
          <div className="mt-1">
            <span
              className={`inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider rounded uppercase border ${getBadgeStyle(
                bus.badgeColor
              )}`}
            >
              {bus.badge}
            </span>
          </div>
        </div>

        {/* Col 2: Current Location */}
        <div className="min-w-[170px]">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Current Location
          </p>
          <p className="text-sm font-medium text-gray-800 mt-0.5">
            {bus.currentLocation}
          </p>
        </div>

        {/* Col 3: Live ETA Countdown (Updates every 1s) */}
        <div className="min-w-[125px]">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Live ETA
          </p>
          <LiveEtaCountdown vehicleId={bus.vehicleId || bus.id} variant="compact" />
        </div>

        {/* Col 4: Crowd Level */}
        <div className="min-w-[140px]">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Crowd Level
          </p>
          <div className="mt-0.5">
            <CrowdBadge level={bus.crowdLevel} percent={bus.crowdPercent} />
          </div>
        </div>

        {/* Col 5: Journey Span */}
        <div className="min-w-[120px]">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Journey Span
          </p>
          <p className="text-sm font-medium text-gray-700 mt-0.5">
            {bus.journeySpan}
          </p>
        </div>

        {/* Col 6: Actions */}
        <div className="flex items-center gap-3 self-end lg:self-center">
          <button
            onClick={() => onCompare ? onCompare(bus) : navigate('/search/compare')}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Compare
          </button>
          <button
            onClick={() => navigate(`/track/${bus.vehicleId}`)}
            className="px-4 py-2 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Track Live
          </button>
        </div>
      </div>
    </div>
  );
}
