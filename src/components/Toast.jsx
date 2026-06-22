import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md
        ${toast.type === 'success' ? 'bg-emerald-50/90 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-100' : 
        toast.type === 'error' ? 'bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100' :
        'bg-blue-50/90 dark:bg-blue-900/90 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-100'}`}
      >
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
