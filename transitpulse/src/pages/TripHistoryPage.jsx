import React, { useState } from 'react';
import { Download, ChevronDown, Calendar } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function TripHistoryPage() {
  const { user, tripHistory, exportHistoryCsv } = useTransit();
  const [selectedRange, setSelectedRange] = useState("September 2024");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Travel Commute History
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Retrieve logs, on-time frequency patterns, and direct transit fare statements.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Range Dropdown matching Image 10 */}
            <div className="relative border border-gray-300 rounded-xl px-3 py-2 bg-white text-xs font-semibold text-gray-800 flex items-center gap-2 shadow-xs cursor-pointer">
              <span>Range: {selectedRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>

            {/* Export CSV Button matching Image 10 */}
            <button
              onClick={exportHistoryCsv}
              className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
              <span>Export CSV (.csv)</span>
            </button>
          </div>
        </div>

        {/* 4 Top Metric Cards matching Image 10 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 tracking-tight">
              {user.stats.monthlyTrips || 42} Trips
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Completed This Month
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 tracking-tight font-mono">
              {user.stats.totalDistanceKm || 184.5} km
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Total Commuted Distance
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-mono">
              {user.stats.avgCommuteMins || 26.4} mins
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Average Commute Duration
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F5B700] tracking-tight">
              {user.stats.mostActiveRoute || "Bus 42A"}
            </p>
            <p className="text-xs font-semibold text-gray-400 mt-1">
              Most Active Transit Route
            </p>
          </div>
        </div>

        {/* Data Table matching Image 10 */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50/80 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">DATE</th>
                  <th className="px-5 py-3.5">ROUTE (FROM → TO)</th>
                  <th className="px-5 py-3.5">VEHICLE LINE</th>
                  <th className="px-5 py-3.5">SCHEDULED WINDOW</th>
                  <th className="px-5 py-3.5">DURATION</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5">CROWD INDEX</th>
                  <th className="px-5 py-3.5 text-right">FARE PAID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {tripHistory.map((row) => {
                  const isOnTime = row.statusType === "success";

                  return (
                    <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-4 text-gray-800 whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        {row.route}
                      </td>
                      <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                        {row.vehicleLine}
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-600 whitespace-nowrap">
                        {row.scheduledWindow}
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-700 whitespace-nowrap">
                        {row.duration}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            isOnTime
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnTime ? "bg-emerald-500" : "bg-rose-500"}`} />
                          <span>{row.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                        {row.crowdIndex}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                        {row.farePaid}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination matching Image 10 */}
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>Showing 1-4 of 142 historical trips</span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-semibold cursor-pointer"
              >
                Prev
              </button>

              <button
                onClick={() => setCurrentPage(1)}
                className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center cursor-pointer ${
                  currentPage === 1
                    ? "bg-[#F5B700] text-gray-950 font-extrabold shadow-xs"
                    : "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                1
              </button>

              <button
                onClick={() => setCurrentPage(2)}
                className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center cursor-pointer ${
                  currentPage === 2
                    ? "bg-[#F5B700] text-gray-950 font-extrabold shadow-xs"
                    : "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                2
              </button>

              <button
                onClick={() => setCurrentPage(3)}
                className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center cursor-pointer ${
                  currentPage === 3
                    ? "bg-[#F5B700] text-gray-950 font-extrabold shadow-xs"
                    : "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                3
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-semibold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
