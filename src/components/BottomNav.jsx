import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, History, User, MapPin } from 'lucide-react';

const navItems = [
  { to: '/',         label: 'Dashboard',     icon: Home },
  { to: '/identify', label: 'Identifikasi',  icon: Search },
  { to: '/map',      label: 'Peta',          icon: MapPin },
  { to: '/history',  label: 'Riwayat',       icon: History },
  { to: '/profile',  label: 'Profil',        icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="max-w-4xl mx-auto flex">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
