import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';
import IdentifyPage from './pages/IdentifyPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-28">
        <Routes>
          <Route path="/"         element={<DashboardPage />} />
          <Route path="/identify" element={<IdentifyPage />} />
          <Route path="/history"  element={<HistoryPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
