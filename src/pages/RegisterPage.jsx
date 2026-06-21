import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registrasi berhasil! Silakan login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md relative overflow-hidden">
        {/* Glow Effects for Dark Mode */}
        <div className="hidden dark:block absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="hidden dark:block absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
                <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold logo-neon-rgb">
                Eco-Logic
              </h1>
            </div>
            <h2 className="text-lg font-medium text-slate-600 dark:text-slate-400">
              Daftar Akun Baru
            </h2>
          </div>
          
          {error && <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-200 dark:border-red-500/20">{error}</div>}
          {success && <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg mb-4 text-sm border border-emerald-200 dark:border-emerald-500/20">{success}</div>}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 text-sm font-medium">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 text-sm font-medium">Email</label>
              <input 
                type="email" 
                required
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 text-sm font-medium">Password</label>
              <input 
                type="password" 
                required
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md shadow-emerald-500/20 transition-all mt-6"
            >
              Daftar
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
            Sudah punya akun? <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
