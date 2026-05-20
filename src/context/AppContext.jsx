import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [points, setPoints] = useState(240);

  const addHistory = (resultData) => {
    if (resultData.category === 'Unknown') return;
    const earned = 15;
    setHistory(prev => [
      { ...resultData, date: new Date().toLocaleDateString('id-ID'), pointsEarned: earned },
      ...prev
    ]);
    setPoints(prev => prev + earned);
  };

  return (
    <AppContext.Provider value={{ history, points, addHistory }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for easy consumption
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
