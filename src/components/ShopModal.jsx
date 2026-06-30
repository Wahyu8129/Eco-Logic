import React from 'react';
import { X, Check, Lock, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SHOP_ITEMS = [
  { id: 'banner_forest', type: 'banner', name: 'Hutan Tropis', price: 100, color: 'bg-emerald-600' },
  { id: 'banner_ocean', type: 'banner', name: 'Samudra Biru', price: 150, color: 'bg-blue-600' },
  { id: 'border_gold', type: 'border', name: 'Bingkai Emas', price: 200, color: 'border-yellow-400' },
  { id: 'border_neon', type: 'border', name: 'Neon Cyber', price: 250, color: 'border-cyan-400' },
];

export default function ShopModal({ isOpen, onClose }) {
  const { points, unlockedItems, activeAccessories, buyItem, equipItem } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-500" /> Point Shop
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Poin Anda saat ini</p>
            <p className="text-2xl font-bold text-yellow-500">{points} Poin</p>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {SHOP_ITEMS.map(item => {
              const isUnlocked = unlockedItems.includes(item.id);
              const isEquipped = activeAccessories[item.type] === item.id;

              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${item.type === 'banner' ? item.color : 'bg-slate-200 dark:bg-slate-800 border-2 ' + item.color}`}></div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{item.type}</p>
                    </div>
                  </div>
                  
                  <div>
                    {!isUnlocked ? (
                      <button 
                        onClick={() => buyItem(item)}
                        disabled={points < item.price}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${
                          points >= item.price 
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3 h-3" /> {item.price} Poin
                      </button>
                    ) : isEquipped ? (
                      <button 
                        onClick={() => equipItem(item.type, null)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                      >
                        <Check className="w-4 h-4 inline mr-1" /> Dipakai
                      </button>
                    ) : (
                      <button 
                        onClick={() => equipItem(item.type, item.id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                      >
                        Pakai
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
