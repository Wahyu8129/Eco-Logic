import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Activity, BarChart2, Zap, Shield, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: [], logs: [] });
  const [loading, setLoading] = useState(true);

  // Check if admin
  useEffect(() => {
    if (!user || (user.email !== 'AdminEco@gmail.com' && user.role !== 'admin')) {
      // Redirect to home if not admin
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && (user.email === 'AdminEco@gmail.com' || user.role === 'admin')) {
      fetchAdminStats();
    }
  }, [user]);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun ${name}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/user/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setStats(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (!user || (user.email !== 'AdminEco@gmail.com' && user.role !== 'admin')) return null;

  return (
    <div className="space-y-6">
      <div className="bg-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-purple-100">Selamat datang, Administrator. Pantau aktivitas pengguna dan AI di sini.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
          <Users className="w-6 h-6 text-blue-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.users.length}</h3>
          <p className="text-xs text-slate-500">Total Pengguna</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
          <Zap className="w-6 h-6 text-yellow-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.users.reduce((acc, curr) => acc + curr.points, 0)}
          </h3>
          <p className="text-xs text-slate-500">Total Poin Beredar</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
          <Database className="w-6 h-6 text-emerald-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.logs?.length || 0}
          </h3>
          <p className="text-xs text-slate-500">Total Aktivitas (DB)</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
          <Activity className="w-6 h-6 text-purple-500 mb-2" />
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Aktif</h3>
          <p className="text-xs text-slate-500">Status EcoBot AI</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-500" /> Daftar Pengguna (Leaderboard)
            </h2>
          </div>
          <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-center text-slate-500 py-4">Memuat data...</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-2 rounded-l-lg">User</th>
                    <th className="px-4 py-2">Level</th>
                    <th className="px-4 py-2">EXP</th>
                    <th className="px-4 py-2">Poin</th>
                    <th className="px-4 py-2 rounded-r-lg text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.users.map((u, i) => (
                    <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{u.name}</td>
                      <td className="px-4 py-3 text-blue-500 font-bold">{u.level}</td>
                      <td className="px-4 py-3 text-emerald-500 font-medium">{u.exp}</td>
                      <td className="px-4 py-3 text-yellow-500 font-bold">{u.points}</td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition"
                          title="Hapus Akun"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" /> Log Aktivitas Database
            </h2>
          </div>
          <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto">
             {loading ? (
              <p className="text-center text-slate-500 py-4">Memuat data...</p>
            ) : stats.logs?.length > 0 ? (
              <ul className="space-y-3">
                {stats.logs.map(log => (
                  <li key={log.id} className="text-sm p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300">User ID {log.user_id}</span> melakukan 
                    <span className="font-semibold text-emerald-500 mx-1">{log.action_type}</span>
                    <span className="text-xs text-slate-400 block mt-1">{new Date(log.created_at).toLocaleString('id-ID')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <p>Belum ada aktivitas di database yang tersimpan.</p>
                <p className="text-xs mt-2">(Aktivitas identifikasi AI saat ini tersimpan di perangkat pengguna masing-masing)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
