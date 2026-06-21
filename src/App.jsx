import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';
import IdentifyPage from './pages/IdentifyPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MapPage from './pages/MapPage';
import EcoBotWidget from './components/EcoBotWidget';
import { useApp } from './context/AppContext';

// Komponen untuk melindungi route yang butuh login
function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Wrapper untuk animasi transisi halaman
function PageTransition({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-page-enter flex-1 w-full flex flex-col pb-32">
      {children}
    </div>
  );
}

export default function App() {
  const { user } = useApp();

  // Jika belum login, tampilkan layout khusus autentikasi (full screen, tanpa nav)
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Jika sudah login, tampilkan layout dashboard
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-emerald-500/30 transition-colors duration-300 flex flex-col">
      <Header />
      
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        <PageTransition>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/identify" element={<IdentifyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </main>

      <EcoBotWidget />
      <BottomNav />
    </div>
  );
}
