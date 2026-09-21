import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, MapPin, ArrowLeft } from 'lucide-react';
import NavBar from '../components/NavBar.jsx';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 flex flex-col">
      <NavBar isDark={false} />

      <main className="flex-1 max-w-xl mx-auto px-4 flex flex-col items-center justify-center text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-900 mb-6">
          <MapPin className="w-8 h-8 text-amber-700" />
        </div>

        <span className="font-mono text-xs font-bold text-amber-600 uppercase tracking-widest">
          ERROR 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-2 tracking-tight">
          Transit Stop Not Found
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          The requested timetable, bus schedule corridor, or URL does not exist or has been relocated.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-[#F5B700] hover:bg-[#e2a800] text-gray-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
