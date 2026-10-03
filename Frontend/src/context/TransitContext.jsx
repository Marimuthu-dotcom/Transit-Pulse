import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { apiJson, setAccessToken } from '../api/client.js';

const TransitContext = createContext(null);

export function TransitProvider({ children }) {

  function normaliseUser(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    nickname: raw.nickname || raw.name || 'Commuter',
    phone: raw.phone || '',
    avatar: raw.avatar || raw.picture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(raw.name || 'Commuter')}&background=F5B700&color=000&bold=true`,
    memberSince: raw.memberSince || new Date().getFullYear().toString(),
    savedCorridorsCount: raw.savedCorridorsCount ?? 0,
    avgDailyCommute: raw.avgDailyCommute || '0 min',
    tier: raw.tier || 'Standard Rider',
    stats: raw.stats || { crowdReportsSubmitted: 0, ridersHelpedToday: 0 },
    preferences: {
      stationSearchRadius: '500 meters',
      preferredMaxCrowdIndex: 'Medium (< 50% capacity)',
      urgentServiceDisruptions: true,
      minorCorridorDelayAdvisories: true,
      platformProximityWarnings: false,
      ...(raw.preferences || {}),
    },
  };
}

  // ── Auth state ──
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // true while restoring session

  // ── Non-auth state (unchanged) ──
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

  // ── Restore session on mount ──
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1. Try to refresh the access token using the httpOnly cookie
        const refreshRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/auth/refresh`,
          { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } }
        );

        if (!refreshRes.ok) {
          if (!cancelled) setAuthLoading(false);
          return;
        }

        const { accessToken } = await refreshRes.json();
        setAccessToken(accessToken);

        // 2. Fetch the current user
        const { user: me } = await apiJson('/api/auth/me');

        if (!cancelled) {
          setUser(normaliseUser(me));
          setIsAuthenticated(true);
        }
      } catch {
        // Silent — user just isn't logged in
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Simulated live tracking ticker: slowly moves coordinates, updates ETA & speed
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) => {
        const next = { ...prev };
        if (next["42A"]) {
          const bus = { ...next["42A"] };
          bus.speed = Math.min(58, Math.max(38, bus.speed + Math.floor(Math.random() * 5) - 2));
          next["42A"] = bus;
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  // ── Auth actions ──
  const login = useCallback(async ({ email, password }) => {
    const data = await apiJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.accessToken);
    setUser(normaliseUser(data.user));
    setIsAuthenticated(true);
    return data.user;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const data = await apiJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setAccessToken(data.accessToken);
    setUser(normaliseUser(data.user));
    setIsAuthenticated(true);
    return data.user;
  }, []);

  const googleLogin = useCallback(async (credential, intent = 'login') => {
  const data = await apiJson('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential, intent }),
  });
  setAccessToken(data.accessToken);
  setUser(normaliseUser({ ...data.user, picture: data.picture }));
  setIsAuthenticated(true);
  return { ...data.user, picture: data.picture };
}, []);

  const logout = useCallback(async () => {
    try {
      await apiJson('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore — clear local state regardless
    }
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Profile updates (send to backend when you have an endpoint; for now, local) ──
  const updateUserProfile = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const updateUserPreferences = (newPrefs) => {
  setUser((prev) =>
    prev ? { ...prev, preferences: { ...(prev.preferences || {}), ...newPrefs } } : prev
  );
};
  // ── Non-auth actions (unchanged) ──
  const addSavedRoute = (newRoute) => {
    const route = { id: `sr-${Date.now()}`, ...newRoute };
    setSavedRoutes((prev) => [route, ...prev]);
  };
  const deleteSavedRoute = (id) => setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
  const addSavedStop = (newStop) => {
    const stop = { id: `stop-${Date.now()}`, ...newStop };
    setSavedStops((prev) => [...prev, stop]);
  };
  const markAllNotificationsAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const snoozeNotification = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, snoozed: true } : n)));

  const submitCrowdReport = ({ busLine, crowdOption, details }) => {
    setUser((prev) => prev ? ({
      ...prev,
      stats: {
        ...(prev.stats || {}),
        crowdReportsSubmitted: (prev.stats?.crowdReportsSubmitted || 0) + 1,
        ridersHelpedToday: (prev.stats?.ridersHelpedToday || 0) + 12,
      }
    }) : prev);

    setLeaderboard((prev) => prev.map((item) => item.isCurrent ? { ...item, reports: item.reports + 1 } : item));

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
    const rows = tripHistory.map((t) =>
      `"${t.date}","${t.route}","${t.vehicleLine}","${t.scheduledWindow}","${t.duration}","${t.status}","${t.crowdIndex}","${t.farePaid}"`
    ).join("\n");
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
        // Auth
        user,
        isAuthenticated,
        authLoading,
        login,
        signup,
        googleLogin,
        logout,
        // Profile
        updateUserProfile,
        updatePreferences: updateUserPreferences,
        // Non-auth
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
      }}
    >
      {children}
    </TransitContext.Provider>
  );
}

export function useTransit() {
  const context = useContext(TransitContext);
  if (!context) 
  {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
}