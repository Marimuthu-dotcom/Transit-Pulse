import React from 'react';

export default function CrowdBadge({ level, percent, showDot = true, className = "" }) {
  // Determine category from level or percent
  const text = level || "";
  const isLow = text.toLowerCase().includes("low") || (percent !== undefined && percent <= 30);
  const isMed = text.toLowerCase().includes("moderate") || text.toLowerCase().includes("medium") || (percent !== undefined && percent > 30 && percent <= 70);
  const isHigh = text.toLowerCase().includes("high") || text.toLowerCase().includes("pack") || (percent !== undefined && percent > 70);

  if (isLow) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium text-emerald-600 text-xs sm:text-sm ${className}`}>
        {showDot && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
        <span>{level || `Low (${percent}%)`}</span>
      </span>
    );
  }

  if (isMed) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium text-amber-600 text-xs sm:text-sm ${className}`}>
        {showDot && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
        <span>{level || `Medium (${percent}%)`}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium text-red-600 text-xs sm:text-sm ${className}`}>
      {showDot && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
      <span>{level || `High (${percent}%)`}</span>
    </span>
  );
}
