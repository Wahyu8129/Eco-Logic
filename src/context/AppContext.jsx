import React, { createContext, useContext, useState, useEffect } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  
  // Theme state: default to 'dark' to match current Eco-Logic style
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const [streak, setStreak] = useState(0);
  const [dailyMission, setDailyMission] = useState(null);

  // Shop State
  const [unlockedItems, setUnlockedItems] = useState(() => JSON.parse(localStorage.getItem('unlocked_items') || '[]'));
  const [activeAccessories, setActiveAccessories] = useState(() => JSON.parse(localStorage.getItem('active_accessories') || '{}'));

  useEffect(() => {
    const today = new Date().toLocaleDateString('id-ID');
    const storedMissionDate = localStorage.getItem('mission_date');
    const storedStreak = parseInt(localStorage.getItem('streak') || '0', 10);
    
    // safe non-B3 items
    const possibleMissions = [
      { id: 1, name: 'Kardus Bekas', itemStr: 'kardus', points: 15 },
      { id: 2, name: 'Kertas / Koran', itemStr: 'kertas', points: 10 },
      { id: 3, name: 'Botol Plastik', itemStr: 'botol', points: 15 },
      { id: 4, name: 'Kaleng Minuman', itemStr: 'kaleng', points: 20 },
      { id: 5, name: 'Kantong Plastik', itemStr: 'plastik', points: 10 },
      { id: 6, name: 'Daun / Ranting', itemStr: 'daun', points: 10 },
    ];

    if (storedMissionDate !== today) {
      // It's a new day!
      const lastCompleted = localStorage.getItem('last_completed_date');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('id-ID');
      
      let currentStreak = storedStreak;
      if (lastCompleted !== yesterdayStr && lastCompleted !== today) {
        // Reset streak if they missed yesterday
        currentStreak = 0;
        localStorage.setItem('streak', '0');
      }

      setStreak(currentStreak);

      // pick new random mission
      const newMission = possibleMissions[Math.floor(Math.random() * possibleMissions.length)];
      setDailyMission(newMission);
      localStorage.setItem('mission_date', today);
      localStorage.setItem('daily_mission', JSON.stringify(newMission));
    } else {
      // Load from storage
      const savedMission = JSON.parse(localStorage.getItem('daily_mission'));
      setDailyMission(savedMission || possibleMissions[2]);
      setStreak(storedStreak);
    }
  }, []);

  useEffect(() => {
    // Apply theme to HTML root element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    // Gunakan View Transitions API untuk efek lingkaran menyebar dari tombol
    if (!document.startViewTransition || !e || !e.clientX) {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      // Kita update React State, jangan force DOM manual di sini
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 600,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      const parsedUser = JSON.parse(storedUser);
      setPoints(parsedUser.points || 0);
    }
  }, []);

  // Load history when user changes
  useEffect(() => {
    if (user && user.id) {
      const saved = localStorage.getItem(`history_${user.id}`);
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  }, [user]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setPoints(userData.points || 0);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPoints(0);
    setHistory([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Jangan hapus history dari localstorage agar tidak reset saat login kembali di perangkat yang sama
  };

  const addHistory = async (resultData) => {
    if (resultData.category === 'Unknown') return;
    
    const today = new Date().toLocaleDateString('id-ID');
    const isMissionTarget = dailyMission && resultData.item_name.toLowerCase().includes(dailyMission.itemStr);
    const lastCompleted = localStorage.getItem('last_completed_date');
    const alreadyCompleted = lastCompleted === today;

    let missionBonus = 0;
    if (isMissionTarget && !alreadyCompleted) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('streak', newStreak.toString());
      localStorage.setItem('last_completed_date', today);
      missionBonus = dailyMission.points + (newStreak * 5); // Base points + Streak Bonus
    }

    const earned = 15 + missionBonus;
    
    // Simpan ke React State (untuk animasi instan UI)
    const newLog = { ...resultData, date: today, pointsEarned: earned };
    setHistory(prev => {
      const updatedHistory = [newLog, ...prev];
      if (user && user.id) {
        localStorage.setItem(`history_${user.id}`, JSON.stringify(updatedHistory));
      }
      return updatedHistory;
    });
    
    setPoints(prev => prev + earned);

    // Sinkronisasi ke Database Backend
    if (user && user.id) {
      try {
        const response = await fetch('http://localhost:5000/api/user/add-points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, pointsToAdd: earned })
        });
        
        if (response.ok) {
          const data = await response.json();
          // Update data user terbaru di state dan localStorage
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (error) {
        console.error('Gagal menyimpan poin ke database:', error);
      }
    }
  };

  const buyItem = async (item) => {
    if (points >= item.price && !unlockedItems.includes(item.id)) {
      setPoints(prev => prev - item.price);
      const newUnlocked = [...unlockedItems, item.id];
      setUnlockedItems(newUnlocked);
      localStorage.setItem('unlocked_items', JSON.stringify(newUnlocked));

      if (user && user.id) {
        try {
          const response = await fetch('http://localhost:5000/api/user/add-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, pointsToAdd: -item.price })
          });
          if (response.ok) {
             const data = await response.json();
             setUser(data.user);
             localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.error(error);
        }
      }
      return true;
    }
    return false;
  };

  const equipItem = (type, itemId) => {
    if (unlockedItems.includes(itemId) || itemId === null) {
      const newActive = { ...activeAccessories, [type]: itemId };
      setActiveAccessories(newActive);
      localStorage.setItem('active_accessories', JSON.stringify(newActive));
    }
  };

  return (
    <AppContext.Provider value={{ 
      history, points, user, token, theme, toggleTheme, login, logout, addHistory, dailyMission, streak,
      unlockedItems, activeAccessories, buyItem, equipItem
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
