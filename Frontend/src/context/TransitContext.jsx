import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUser,
  busVehicles,
  initialSavedRoutes,
  initialSavedStops,
  initialTripHistory,
  initialNotifications,
  leaderboardData,
  userBadges
} from '../data/mockTransitData.js';

const TransitContext = createContext(null);

export function TransitProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('transitpulse_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('transitpulse_auth') !== 'false';
  });

  const [buses, setBuses] = useState(busVehicles);
  const [savedRoutes, setSavedRoutes] = useState(initialSavedRoutes);
  const [savedStops, setSavedStops] = useState(initialSavedStops);
  const [tripHistory, setTripHistory] = useState(initialTripHistory);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [leaderboard, setLeaderboard] = useState(leaderboardData);
  const [badges] = useState(userBadges);

  const [searchParams, setSearchParams] = useState({
    origin: "Downtown Central Station",
    destination: "Airport Terminal 1",
    preference: "Fastest Route",
    departDate: "Today",
    departTime: "Leave Now",
  });

  // Simulated live tracking ticker: slowly moves coordinates, updates ETA & speed
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) => {
        const next = { ...prev };
        if (next["42A"]) {
          const bus = { ...next["42A"] };
          // Random slight speed variation
          bus.speed = Math.min(58, Math.max(38, bus.speed + Math.floor(Math.random() * 5) - 2));
          next["42A"] = bus;
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const login = (email, password) => {
    setIsAuthenticated(true);
    localStorage.setItem('transitpulse_auth', 'true');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('transitpulse_auth', 'false');
  };

  const updateUserProfile = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('transitpulse_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateUserPreferences = (newPrefs) => {
    setUser((prev) => {
      const updated = {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...newPrefs,
        }
      };
      localStorage.setItem('transitpulse_user', JSON.stringify(updated));
      return updated;
    });
  };

  const addSavedRoute = (newRoute) => {
    const route = {
      id: `sr-${Date.now()}`,
      ...newRoute
    };
    setSavedRoutes((prev) => [route, ...prev]);
  };

  const deleteSavedRoute = (id) => {
    setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const addSavedStop = (newStop) => {
    const stop = {
      id: `stop-${Date.now()}`,
      ...newStop
    };
    setSavedStops((prev) => [...prev, stop]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const snoozeNotification = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, snoozed: true } : n))
    );
  };

  const submitCrowdReport = ({ busLine, crowdOption, details }) => {
    // Increase user impact
    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        crowdReportsSubmitted: prev.stats.crowdReportsSubmitted + 1,
        ridersHelpedToday: prev.stats.ridersHelpedToday + 12,
      }
    }));

    // Update leaderboard
    setLeaderboard((prev) =>
      prev.map((item) =>
        item.isCurrent ? { ...item, reports: item.reports + 1 } : item
      )
    );

    // If matches a known bus, update its crowd status
    const key = busLine.includes("42A") ? "42A" : busLine.includes("10B") ? "10B" : "EXP4";
    if (buses[key]) {
      setBuses((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          crowdLevel: crowdOption.label + ` (${crowdOption.percent}%)`,
          crowdPercent: crowdOption.percent,
          crowdCategory: crowdOption.category,
        }
      }));
    }
  };

  const exportHistoryCsv = () => {
    const headers = "Date,Route,Vehicle Line,Scheduled Window,Duration,Status,Crowd Index,Fare Paid\n";
    const rows = tripHistory
      .map(
        (t) =>
          `"${t.date}","${t.route}","${t.vehicleLine}","${t.scheduledWindow}","${t.duration}","${t.status}","${t.crowdIndex}","${t.farePaid}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `transitpulse-commute-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TransitContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        buses,
        savedRoutes,
        addSavedRoute,
        deleteSavedRoute,
        savedStops,
        addSavedStop,
        tripHistory,
        exportHistoryCsv,
        notifications,
        markAllNotificationsAsRead,
        snoozeNotification,
        leaderboard,
        badges,
        searchParams,
        setSearchParams,
        submitCrowdReport,
        updateUserProfile,
        updatePreferences: updateUserPreferences,
      }}
    >
      {children}
    </TransitContext.Provider>
  );
}

export function useTransit() {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
}
