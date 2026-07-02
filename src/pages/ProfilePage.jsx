import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, User, Mail, Award, Settings, Edit2, Check, X, ShoppingBag, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShopModal from '../components/ShopModal';

export default function ProfilePage() {
  const { user, points, exp, level, logout, login, token, activeAccessories, avatar, updateAvatar } = useApp();
  const maxExp = Math.floor(100 * Math.pow(1.5, (level || 1) - 1));
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const avatars = [
    { id: 'default', src: null },
    { id: 'profile_1', src: '/avatars/profile_1.png' },
    { id: 'profile_2', src: '/avatars/profile_2.png' },
    { id: 'profile_3', src: '/avatars/profile_3.png' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async () => {
    if (!editName.trim() || editName === user.name) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: editName })
      });
      if (response.ok) {
        const data = await response.json();
        login(data.user, token);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden ${
        activeAccessories?.banner === 'banner_forest' ? 'bg-emerald-600/20 dark:bg-emerald-900/40' : 
        activeAccessories?.banner === 'banner_ocean' ? 'bg-blue-600/20 dark:bg-blue-900/40' : ''
      }`}>
        {/* Dekorasi Background */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
            <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center relative z-10 overflow-hidden ${
              activeAccessories?.border === 'border_gold' ? 'border-[4px] border-yellow-400' :
              activeAccessories?.border === 'border_neon' ? 'border-[4px] border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' :
              'border-4 border-white dark:border-slate-800'
            }`}>
               {avatar ? (
                 <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-12 h-12 text-white" />
               )}
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Edit2 className="w-6 h-6 text-white" />
               </div>
            </div>
            {/* Animated Avatar Border */}
            {!activeAccessories?.border && (
              <div className="absolute inset-[-4px] rounded-full border-[3px] border-emerald-400 dark:border-emerald-500 border-dashed animate-[spin_6s_linear_infinite] opacity-70 pointer-events-none"></div>
            )}
            <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse-soft pointer-events-none"></div>
          </div>
          
          <div className="text-center w-full px-6">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2 mb-2">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isSaving}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-1 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button onClick={handleSave} disabled={isSaving} className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setIsEditing(false); setEditName(user.name); }} disabled={isSaving} className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-emerald-500 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2 mt-1">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div 
          onClick={() => setIsShopOpen(true)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-yellow-500/30 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 group relative"
        >
          <span className="absolute top-2 right-2 text-[10px] bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 px-2 py-0.5 rounded font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingBag className="w-3 h-3" /> Shop
          </span>
          <Award className="w-8 h-8 text-yellow-500" />
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Poin</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{points}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
          <Zap className="w-8 h-8 text-blue-500" />
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Level {level || 1}</p>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{exp || 0} / {maxExp} XP</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
          <Settings className="w-8 h-8 text-slate-500" />
          <div className="text-center">
            <p className="text-sm text-slate-400">Pengaturan</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">Belum Tersedia</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 py-3 px-4 rounded-xl font-semibold hover:bg-red-500/20 hover:border-red-500/30 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Keluar (Log Out)
      </button>

      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-scale-up border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pilih Avatar</h2>
              <button onClick={() => setIsAvatarModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {avatars.map((av) => (
                <div 
                  key={av.id}
                  onClick={() => {
                    updateAvatar(av.src);
                    setIsAvatarModalOpen(false);
                  }}
                  className={`relative aspect-square rounded-xl cursor-pointer overflow-hidden border-2 transition-all hover:scale-105 ${avatar === av.src ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  {av.src ? (
                    <img src={av.src} alt={av.id} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <User className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  {avatar === av.src && (
                    <div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
