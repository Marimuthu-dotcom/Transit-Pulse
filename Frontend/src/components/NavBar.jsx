import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, RefreshCw, Settings, Bus, User, LogOut } from 'lucide-react';
import { useTransit } from '../context/TransitContext.jsx';

export default function NavBar({ isDark = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, notifications, isAuthenticated, logout } = useTransit();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Routes', path: '/routes' },
    { name: 'Notifications', path: '/notifications', badge: unreadCount },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/search') return location.pathname.startsWith('/search');
    return location.pathname.startsWith(path);
  };

  const bgClass = isDark
    ? "bg-[#ffffff] border-b border-gray-800/80 text-white"
    : "bg-white border-b border-gray-200/80 text-gray-900";

  // Fallback avatar initials when the user has no picture
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className={`w-full sticky top-0 z-50 transition-colors duration-200 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#F5B700] flex items-center justify-center shadow-sm text-black font-extrabold group-hover:bg-[#e0a600] transition-colors">
            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-gray-950">Transit</span>
            <span className="text-[#F5B700]">Pulse</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "text-yellow-500 font-semibold" : "text-gray-950 hover:text-yellow-500"
                }`}
              >
                <span>{item.name}</span>
                {item.badge > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#F5B700] text-black">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.75 bg-[#F5B700] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => window.location.reload()}
            title="Refresh Live Transit Feed"
            className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            to="/notifications"
            title="Notifications Hub"
            className="relative p-2 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F5B700] ring-2 ring-white"></span>
            )}
          </Link>

          {/* Only show settings icon when logged in */}
          {isAuthenticated && (
            <Link
              to="/profile"
              title="Profile & Settings"
              className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Link>
          )}

          {/* If logged in → profile capsule. If not → Sign In button. */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full border border-gray-200 bg-white hover:border-gray-300 text-left shadow-xs"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#F5B700]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#F5B700] text-black text-[11px] font-bold flex items-center justify-center ring-1 ring-[#F5B700]">
                    {initials}
                  </div>
                )}
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-gray-900 truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">Rider</span>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-1.5 z-50 text-sm animate-in fade-in slide-in-from-top-1 bg-[#161c28] border-gray-700 text-gray-200">
                  <div className="px-3 py-2 border-b border-gray-700/60">
                    <p className="text-xs font-semibold truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-xs"
                  >
                    <Settings className="w-3.5 h-3.5" /> Rider Profile & Settings
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-xs"
                  >
                    <Bus className="w-3.5 h-3.5" /> Commute History
                  </Link>
                  <Link
                    to="/report"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-xs"
                  >
                    <User className="w-3.5 h-3.5" /> Report Crowd Level
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-xs"
                  >
                    Help Center
                  </Link>
                  <div className="border-t border-gray-700/60 mt-1"></div>
                  <button
                    onClick={async () => {
                      setShowDropdown(false);
                      await logout();
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-950/30 text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-[#F5B700] hover:bg-[#e2a800] text-black text-xs font-bold rounded-xl transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}