import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, History, User, MapPin, Trophy } from 'lucide-react';

import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { user } = useApp();
  
  const isAdmin = user?.email === 'AdminEco@gmail.com' || user?.role === 'admin';
  
  const navItems = isAdmin ? [
    { to: '/admin', label: 'Admin', icon: Home },
    { to: '/profile', label: 'Profil', icon: User },
  ] : [
    { to: '/',         label: 'Dashboard', icon: Home },
    { to: '/identify', label: 'Cari',      icon: Search },
    { to: '/map',      label: 'Peta',      icon: MapPin },
    { to: '/history',  label: 'Riwayat',   icon: History },
    { to: '/leaderboard', label: 'Peringkat', icon: Trophy },
    { to: '/profile',  label: 'Profil',    icon: User },
  ];

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
