import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, AlertTriangle, Award, UploadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const { points, history } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
          <Leaf className="w-6 h-6 text-emerald-500 mb-3" />
          <h3 className="text-3xl font-bold text-slate-100">{history.length}</h3>
          <p className="text-sm text-slate-400 mt-1">Aksi Peduli</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-red-500/30 transition-colors">
          <AlertTriangle className="w-6 h-6 text-red-500 mb-3" />
          <h3 className="text-3xl font-bold text-slate-100">
            {history.filter(h => h.category.includes('B3')).length}
          </h3>
          <p className="text-sm text-slate-400 mt-1">Limbah B3 Diselamatkan</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1 hover:border-yellow-500/30 transition-colors">
          <Award className="w-6 h-6 text-yellow-500 mb-3" />
          <h3 className="text-3xl font-bold text-slate-100">{points}</h3>
          <p className="text-sm text-slate-400 mt-1">Poin Terkumpul</p>
        </div>
      </div>

      {/* Daily Mission */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Misi Anda Hari Ini</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <UploadCloud className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-200">Identifikasi 1 Botol Plastik</h4>
                <p className="text-xs text-slate-500">+15 Poin</p>
              </div>
            </div>
            <Link
              to="/identify"
              className="text-sm bg-slate-800 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400 font-medium transition-colors border border-transparent hover:border-emerald-500/30"
            >
              Mulai
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {history.length > 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Aktivitas Terakhir</h2>
            <Link to="/history" className="text-xs text-emerald-400 hover:text-emerald-300">
              Lihat Semua →
            </Link>
          </div>
          <div className="space-y-2">
            {history.slice(0, 3).map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-200">{log.item_name}</p>
                  <p className="text-xs text-slate-500">{log.date}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-400">+{log.pointsEarned} Poin</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
