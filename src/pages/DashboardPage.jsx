import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, AlertTriangle, Award, UploadCloud, CheckCircle2, ShoppingBag, CalendarDays, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ShopModal from '../components/ShopModal';

export default function DashboardPage() {
  const { points, history, dailyMissions, weeklyMissions, streak, exp, level, normalSubmitCount, maxNormalSubmits, user } = useApp();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
      const wibNow = new Date(utcNow + (7 * 3600000));
      
      const tomorrowWIB = new Date(wibNow);
      tomorrowWIB.setHours(24, 0, 0, 0);
      
      const diffMs = tomorrowWIB.getTime() - wibNow.getTime();
      const hours = Math.floor(diffMs / 3600000);
      const mins = Math.floor((diffMs % 3600000) / 60000);
      
      setTimeLeft(`${hours}j ${mins}m`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const todayDate = new Date().toLocaleDateString('id-ID');
  
  const maxExp = Math.floor(100 * Math.pow(1.5, level - 1));
  const expPercentage = Math.min(100, Math.max(0, (exp / maxExp) * 100));

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-colors animate-float">
          <Leaf className="w-6 h-6 text-emerald-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{history.length}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Aksi Peduli</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-500/30 transition-colors">
          <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {history.filter(h => h.category && h.category.includes('B3')).length}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Limbah B3</p>
        </div>
        <div 
          onClick={() => setIsShopOpen(true)}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-yellow-500/30 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 group"
        >
          <div className="flex justify-between items-start">
            <Award className="w-6 h-6 text-yellow-500 mb-2" />
            <span className="text-[10px] bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 px-1 py-0.5 rounded font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <ShoppingBag className="w-3 h-3" /> Shop
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{points}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Poin</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Lv.{level}</h3>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${expPercentage}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 text-right">{exp} / {maxExp} XP</p>
          </div>
        </div>
      </div>

      {/* Daily Limits */}
      {(!user || (user.email !== 'AdminEco@gmail.com' && user.role !== 'admin')) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 animate-slide-up delay-75">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Batas Poin & EXP Harian (Non-Misi)</h2>
                <p className="text-xs text-slate-500">Maksimal {maxNormalSubmits} kali identifikasi normal per hari.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{normalSubmitCount} / {maxNormalSubmits}</span>
              <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-purple-500 h-full transition-all" style={{width: `${(normalSubmitCount / maxNormalSubmits) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Missions */}
      {(!user || (user.email !== 'AdminEco@gmail.com' && user.role !== 'admin')) && (
        <div className="grid md:grid-cols-2 gap-6 animate-slide-up delay-100">
        
        {/* Daily Missions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-emerald-500" /> Misi Harian
            </h2>
            <div className="flex items-center gap-2">
              {streak > 0 && <span className="text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-500/10 px-2 py-1 rounded-md">🔥 Streak x{streak}</span>}
              <span className="text-[10px] text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Reset dlm {timeLeft}</span>
            </div>
          </div>
          <div className="space-y-3">
            {dailyMissions.map((mission, idx) => {
              const isMissionComplete = mission.progress >= mission.target;
              return (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${isMissionComplete ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isMissionComplete ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-blue-500/20 border-blue-500/30'}`}>
                      {isMissionComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <span className="text-xs font-bold text-blue-500">{mission.progress}/{mission.target}</span>}
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${isMissionComplete ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>
                        {mission.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        +{mission.points} Poin | +{mission.exp || mission.points} EXP
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Missions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" /> Misi Mingguan
            </h2>
            <span className="text-[10px] text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Reset setiap awal minggu</span>
          </div>
          <div className="space-y-3">
            {weeklyMissions.map((mission, idx) => {
              const isMissionComplete = mission.progress >= mission.target;
              return (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${isMissionComplete ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${isMissionComplete ? 'bg-blue-500/20 border-blue-500/30' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                      {isMissionComplete ? <CheckCircle2 className="w-5 h-5 text-blue-500" /> : <span className="text-xs font-bold text-slate-500">{mission.progress}/{mission.target}</span>}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className={`text-sm font-medium ${isMissionComplete ? 'text-blue-700 dark:text-blue-400 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>
                           {mission.name}
                         </h4>
                         <span className="text-[10px] font-bold text-blue-500">+{mission.points} Poin | +{mission.exp || mission.points} EXP</span>
                      </div>
                      {!isMissionComplete && (
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div className="bg-blue-500 h-full transition-all" style={{width: `${(mission.progress / mission.target) * 100}%`}}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        </div>
      )}

      {/* Recent Activity */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-slide-up delay-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Aktivitas Terakhir</h2>
            <Link to="/history" className="text-xs text-emerald-400 hover:text-emerald-300">
              Lihat Semua →
            </Link>
          </div>
          <div className="space-y-2">
            {history.slice(0, 3).map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{log.item_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{log.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-emerald-400 block">+{log.pointsEarned} Poin</span>
                  <span className="text-xs font-medium text-blue-400 block">+{log.expEarned} EXP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </div>
  );
}
