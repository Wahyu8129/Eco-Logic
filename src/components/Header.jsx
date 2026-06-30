import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ShopModal from './ShopModal';

export default function Header() {
  const { points, theme, toggleTheme, activeAccessories } = useApp();
  const [isShopOpen, setIsShopOpen] = React.useState(false);

  return (
    <>
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg transition-colors ${
        activeAccessories?.banner === 'banner_forest' ? 'bg-emerald-600/30 dark:bg-emerald-900/60' : 
        activeAccessories?.banner === 'banner_ocean' ? 'bg-blue-600/30 dark:bg-blue-900/60' : 'bg-slate-50/80 dark:bg-slate-900/80'
    }`}>
      <div className="flex items-center gap-2">
        <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
          <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold logo-neon-rgb">
          Eco-Logic
        </h1>
      </div>
      <div className="flex items-center gap-4 text-sm font-medium">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          title="Ubah Tema"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => setIsShopOpen(true)}
          className="flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 cursor-pointer rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
        >
          <Award className="w-4 h-4 text-yellow-500" />
          <span>{points} Poin</span>
        </button>
        <Link to="/profile">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 hover:scale-110 transition cursor-pointer ${
            activeAccessories?.border === 'border_gold' ? 'border-[2px] border-yellow-400' :
            activeAccessories?.border === 'border_neon' ? 'border-[2px] border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' :
            'border-2 border-slate-800'
          }`}></div>
        </Link>
      </div>
    </header>
    <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </>
  );
}
