import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LeaderboardPage() {
  const { user } = useApp();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30';
      case 1: return 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/30';
      case 2: return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30';
      default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-slate-400" />;
      case 2: return <Award className="w-5 h-5 text-orange-400" />;
      default: return <span className="font-bold text-sm w-5 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Peringkat Global</h2>
            <p className="text-emerald-100 text-sm">Pahlawan lingkungan terbaik minggu ini</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20">
            <Trophy className="w-8 h-8 text-yellow-300 drop-shadow-md" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Memuat peringkat...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((u, index) => (
              <div 
                key={u.id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${getRankStyle(index)} ${user?.id === u.id ? 'ring-2 ring-emerald-500/50 shadow-md scale-[1.02]' : 'hover:scale-[1.01]'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{u.name} {user?.id === u.id && '(Anda)'}</h3>
                    <p className="text-xs opacity-70 font-medium">Lv.{u.level || 1} • {u.exp || 0} XP</p>
                  </div>
                </div>
                <div className="font-bold flex items-center gap-1">
                  {u.points} <span className="text-xs opacity-70 font-normal">pts</span>
                </div>
              </div>
            ))}
            
            {leaderboard.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                Belum ada data peringkat. Jadilah yang pertama!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
