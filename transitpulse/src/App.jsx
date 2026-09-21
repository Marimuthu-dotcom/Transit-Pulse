import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TransitProvider } from './context/TransitContext.jsx';
import { Mic, Sparkles } from 'lucide-react';
import TransitVoiceAssistant from './components/TransitVoiceAssistant.jsx';

import HomePage from './pages/HomePage.jsx';
import SearchFormPage from './pages/SearchFormPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import CompareRoutesPage from './pages/CompareRoutesPage.jsx';
import LiveTrackingPage from './pages/LiveTrackingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SavedRoutesPage from './pages/SavedRoutesPage.jsx';
import SavedStopsPage from './pages/SavedStopsPage.jsx';
import ReportCrowdPage from './pages/ReportCrowdPage.jsx';
import TripHistoryPage from './pages/TripHistoryPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfileSettingsPage from './pages/ProfileSettingsPage.jsx';
import HelpCenterPage from './pages/HelpCenterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  return (
    <TransitProvider>
      <Router>
        {/* Tier 1 Mandated Google Maps Quota Banner */}
        {quotaExceeded && (
          <div className="bg-amber-500 text-black px-4 py-2 text-center text-sm font-medium z-50 shadow-md">
            Maps API quota exceeded. Some map features may be unavailable.
          </div>
        )}

        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchFormPage />} />
          <Route path="/search/results" element={<SearchResultsPage />} />
          <Route path="/search/compare" element={<CompareRoutesPage />} />
          <Route path="/track" element={<LiveTrackingPage />} />
          <Route path="/track/:vehicleId" element={<LiveTrackingPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Commuter Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes"
            element={
              <ProtectedRoute>
                <SavedRoutesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stops"
            element={
              <ProtectedRoute>
                <SavedStopsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportCrowdPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <TripHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global Floating AI Voice Assistant Button */}
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-[#F5B700] text-black font-extrabold text-xs shadow-2xl hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300 border-2 border-amber-300 cursor-pointer"
            title="Ask TransitPulse AI Voice Assistant"
          >
            {/* Pulsing ring */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />

            <Mic className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline tracking-tight">Transit AI Voice</span>
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        {/* Global Voice Assistant Dialog */}
        <TransitVoiceAssistant
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
        />
      </Router>
    </TransitProvider>
  );
}

