import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, UploadCloud, SortAsc, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const getCategoryColor = (category) => {
  if (category.includes('B3')) return 'text-red-400 border-red-500/50 bg-red-500/10';
  if (category.includes('Anorganik')) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
  if (category.includes('Organik')) return 'text-green-400 border-green-500/50 bg-green-500/10';
  return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
};

export default function HistoryPage() {
  const { history } = useApp();
  const [displayHistory, setDisplayHistory] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    if (!isSorted) {
      setDisplayHistory(history);
    }
  }, [history, isSorted]);

  const handleSortPriority = async () => {
    if (isSorted) {
      // Revert to original
      setIsSorted(false);
      return;
    }

    setIsSorting(true);
    try {
      const response = await fetch('http://localhost:5000/api/waste/priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wastes: history })
      });
      const data = await response.json();
      if (response.ok) {
        setDisplayHistory(data.data);
        setIsSorted(true);
      } else {
        alert('Gagal mengurutkan prioritas: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat memanggil algoritma Greedy.');
    } finally {
      setIsSorting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-5 h-5" />
          Log Pembuangan (Reporting System)
        </h2>
        {history.length > 0 && (
          <button 
            onClick={handleSortPriority}
            disabled={isSorting}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isSorted 
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/50' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isSorting ? <Loader2 className="w-4 h-4 animate-spin" /> : <SortAsc className="w-4 h-4" />}
            {isSorted ? 'Batal Urut Prioritas' : 'Urutkan Prioritas (Greedy)'}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-500">
          <UploadCloud className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Belum ada aktivitas pembuangan.</p>
          <Link to="/identify" className="text-emerald-400 mt-2 text-sm inline-block hover:text-emerald-300 transition-colors">
            Mulai Identifikasi →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayHistory.map((log, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-lg transition-all animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">{log.item_name}</h4>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-500">{log.date}</span>
                  <span className="text-slate-700">•</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getCategoryColor(log.category)}`}>
                    {log.category.split(' ')[0]}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-emerald-400">+{log.pointsEarned} Poin</span>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {isSorted ? `Prioritas #${idx + 1}` : 'Berhasil dicatat'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
