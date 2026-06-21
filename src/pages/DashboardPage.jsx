import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, AlertTriangle, Award, UploadCloud, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ShopModal from '../components/ShopModal';

export default function DashboardPage() {
  const { points, history, dailyMission, streak } = useApp();
  const [isShopOpen, setIsShopOpen] = React.useState(false);
  
  const todayDate = new Date().toLocaleDateString('id-ID');
  const isMissionComplete = dailyMission && history.some(log => log.item_name.toLowerCase().includes(dailyMission.itemStr) && log.date === todayDate);

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-slide-up">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-colors animate-float">
          <Leaf className="w-6 h-6 text-emerald-500 mb-3" />
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{history.length}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aksi Peduli</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-500/30 transition-colors">
          <AlertTriangle className="w-6 h-6 text-red-500 mb-3" />
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {history.filter(h => h.category.includes('B3')).length}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Limbah B3 Diselamatkan</p>
        </div>
        <div 
          onClick={() => setIsShopOpen(true)}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1 hover:border-yellow-500/30 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 group"
        >
          <div className="flex justify-between items-start">
            <Award className="w-6 h-6 text-yellow-500 mb-3" />
            <span className="text-xs bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 px-2 py-1 rounded font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <ShoppingBag className="w-3 h-3" /> Shop
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{points}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Poin Terkumpul</p>
        </div>
      </div>

      {/* Daily Mission */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-slide-up delay-100">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Misi Anda Hari Ini</h2>
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isMissionComplete ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isMissionComplete ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-blue-500/20 border-blue-500/30'}`}>
                {isMissionComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse-soft" /> : <UploadCloud className="w-5 h-5 text-blue-400" />}
              </div>
              <div>
                <h4 className={`font-medium ${isMissionComplete ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`}>
                  Identifikasi 1 {dailyMission?.name || 'Item'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  +{dailyMission?.points || 15} Poin {streak > 0 && <span className="text-orange-500 ml-1 font-semibold">🔥 Streak x{streak} (+{streak * 5} Bonus)</span>}
                </p>
              </div>
            </div>
            {isMissionComplete ? (
              <span className="text-sm px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                Selesai <CheckCircle2 className="w-4 h-4" />
              </span>
            ) : (
              <Link
                to="/identify"
                className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Mulai
              </Link>
            )}
          </div>
        </div>
      </div>

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
                <span className="text-sm font-semibold text-emerald-400">+{log.pointsEarned} Poin</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </div>
  );
}
