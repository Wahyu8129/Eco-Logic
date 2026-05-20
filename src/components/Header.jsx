import React from 'react';
import { Leaf, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { points } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
          <Leaf className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Eco-Logic
        </h1>
      </div>
      <div className="flex items-center gap-4 text-sm font-medium">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
          <Award className="w-4 h-4 text-yellow-500" />
          <span>{points} Poin</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 border-2 border-slate-800"></div>
      </div>
    </header>
  );
}
