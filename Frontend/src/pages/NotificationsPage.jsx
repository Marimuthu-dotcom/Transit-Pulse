import React, { useState } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';
import { useTransit } from '../context/TransitContext.jsx';

export default function NotificationsPage() {
  const { notifications, markAllNotificationsAsRead, snoozeNotification } = useTransit();
  const [filter, setFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "All Notifications (12)" },
    { id: "alerts", label: "Alerts (3)" },
    { id: "transit", label: "Transit Updates (5)" },
    { id: "reminders", label: "Personal Reminders (4)" },
  ];

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.category === filter;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Notification Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Stay updated with instant transit advisories, upcoming direct arrivals, and smart alternative routing
            </p>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            Mark All as Read
          </button>
        </div>

        {/* Filter Pills matching Image 11 */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#F5B700] text-gray-950 shadow-xs"
                    : "bg-gray-100 hover:bg-gray-200/70 text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notifications List matching Image 11 */}
        <div className="mt-6 space-y-3.5">
          {filtered.map((item) => {
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border border-gray-200/90 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all border-l-4 ${item.borderAccent}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      {item.title}
                    </h3>
                    {item.tag && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-red-600 text-white uppercase tracking-wider">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0 text-xs">
                  <span className="text-gray-400 font-medium">
                    {item.timestamp}
                  </span>
                  <button
                    onClick={() => snoozeNotification(item.id)}
                    className="text-gray-500 hover:text-gray-900 font-semibold text-xs cursor-pointer hover:underline"
                  >
                    {item.snoozed ? "Snoozed" : "Snooze"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
