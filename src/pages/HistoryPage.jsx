import React from 'react';
import { Link } from 'react-router-dom';
import { History, UploadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';

const getCategoryColor = (category) => {
  if (category.includes('B3')) return 'text-red-400 border-red-500/50 bg-red-500/10';
  if (category.includes('Anorganik')) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
  if (category.includes('Organik')) return 'text-green-400 border-green-500/50 bg-green-500/10';
  return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
};

export default function HistoryPage() {
  const { history } = useApp();

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 animate-in fade-in duration-500">
      <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
        <History className="w-5 h-5" />
        Log Pembuangan (Reporting System)
      </h2>

      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <UploadCloud className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Belum ada aktivitas pembuangan.</p>
          <Link to="/identify" className="text-emerald-400 mt-2 text-sm inline-block hover:text-emerald-300 transition-colors">
            Mulai Identifikasi →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((log, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div>
                <h4 className="font-medium text-slate-200">{log.item_name}</h4>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-xs text-slate-500">{log.date}</span>
                  <span className="text-slate-700">•</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getCategoryColor(log.category)}`}>
                    {log.category.split(' ')[0]}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-emerald-400">+{log.pointsEarned} Poin</span>
                <p className="text-xs text-slate-500 mt-1">Berhasil dicatat</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
