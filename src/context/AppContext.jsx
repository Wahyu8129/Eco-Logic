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
  const [dailyMissions, setDailyMissions] = useState([]);
  const [weeklyMissions, setWeeklyMissions] = useState([]);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);

  // Shop State
  const [unlockedItems, setUnlockedItems] = useState(() => JSON.parse(localStorage.getItem('unlocked_items') || '[]'));
  const [activeAccessories, setActiveAccessories] = useState(() => JSON.parse(localStorage.getItem('active_accessories') || '{}'));

  // Toast State
  const [toast, setToast] = useState(null);

  // Avatar State
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || null);
  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
    if (newAvatar) {
      localStorage.setItem('avatar', newAvatar);
    } else {
      localStorage.removeItem('avatar');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user || !user.id) return;

    const userId = user.id;
    const today = new Date().toLocaleDateString('id-ID');
    const getWeekKey = () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
      const week1 = new Date(d.getFullYear(), 0, 4);
      return d.getFullYear() + '-W' + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    };
    const currentWeek = getWeekKey();

    const storedMissionDate = localStorage.getItem(`mission_date_${userId}`);
    const storedWeeklyMissionDate = localStorage.getItem(`weekly_mission_date_${userId}`);
    const storedStreak = parseInt(localStorage.getItem(`streak_${userId}`) || '0', 10);
    
    // safe non-B3 items
    const possibleDailyMissions = [
      { id: 1, name: 'Kardus Bekas', itemStr: 'kardus', points: 15, exp: 15, target: 1 },
      { id: 2, name: 'Kertas / Koran', itemStr: 'kertas', points: 10, exp: 10, target: 1 },
      { id: 3, name: 'Botol Plastik', itemStr: 'botol', points: 15, exp: 15, target: 1 },
      { id: 4, name: 'Kaleng Minuman', itemStr: 'kaleng', points: 20, exp: 20, target: 1 },
      { id: 5, name: 'Kantong Plastik', itemStr: 'plastik', points: 10, exp: 10, target: 1 },
      { id: 6, name: 'Daun / Ranting', itemStr: 'daun', points: 10, exp: 10, target: 1 },
    ];

    const possibleWeeklyMissions = [
      { id: 'w1', name: 'Identifikasi 10 Sampah', type: 'any', target: 10, points: 100, exp: 100 },
      { id: 'w2', name: 'Identifikasi 5 Sampah Organik', type: 'organik', target: 5, points: 100, exp: 100 },
      { id: 'w3', name: 'Identifikasi 5 Sampah Anorganik', type: 'anorganik', target: 5, points: 100, exp: 100 },
      { id: 'w4', name: 'Identifikasi 3 Botol Plastik', type: 'botol', target: 3, points: 50, exp: 50 },
    ];

    if (storedMissionDate !== today) {
      const lastCompleted = localStorage.getItem(`last_completed_date_${userId}`);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('id-ID');
      
      let currentStreak = storedStreak;
      if (lastCompleted !== yesterdayStr && lastCompleted !== today) {
        currentStreak = 0;
        localStorage.setItem(`streak_${userId}`, '0');
      }
      setStreak(currentStreak);

      const shuffled = [...possibleDailyMissions].sort(() => 0.5 - Math.random());
      const newMissions = shuffled.slice(0, 3).map(m => ({ ...m, progress: 0 }));
      setDailyMissions(newMissions);
      localStorage.setItem(`mission_date_${userId}`, today);
      localStorage.setItem(`daily_missions_${userId}`, JSON.stringify(newMissions));
    } else {
      const savedMissions = JSON.parse(localStorage.getItem(`daily_missions_${userId}`)) || [];
      setDailyMissions(savedMissions.length ? savedMissions : possibleDailyMissions.slice(0, 3).map(m => ({ ...m, progress: 0 })));
      setStreak(storedStreak);
    }

    if (storedWeeklyMissionDate !== currentWeek) {
      const shuffledW = [...possibleWeeklyMissions].sort(() => 0.5 - Math.random());
      const newWeeklyMissions = shuffledW.slice(0, 2).map(m => ({ ...m, progress: 0 }));
      setWeeklyMissions(newWeeklyMissions);
      localStorage.setItem(`weekly_mission_date_${userId}`, currentWeek);
      localStorage.setItem(`weekly_missions_${userId}`, JSON.stringify(newWeeklyMissions));
    } else {
      const savedWeeklyMissions = JSON.parse(localStorage.getItem(`weekly_missions_${userId}`)) || [];
      setWeeklyMissions(savedWeeklyMissions.length ? savedWeeklyMissions : possibleWeeklyMissions.slice(0, 2).map(m => ({ ...m, progress: 0 })));
    }
  }, [user]);


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
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setPoints(parsedUser.points || 0);
      setExp(parsedUser.exp || 0);
      setLevel(parsedUser.level || 1);
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
    setExp(userData.exp || 0);
    setLevel(userData.level || 1);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPoints(0);
    setExp(0);
    setLevel(1);
    setHistory([]);
    setDailyMissions([]);
    setWeeklyMissions([]);
    setNormalSubmitCount(0);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Jangan hapus history dari localstorage agar tidak reset saat login kembali di perangkat yang sama
  };

  const addHistory = async (resultData) => {
    if (resultData.category === 'Unknown') return;
    
    const today = new Date().toLocaleDateString('id-ID');
    
    let missionBonusPoints = 0;
    let missionBonusExp = 0;
    let completedAnyMission = false;

    // Daily Missions progress
    let newDailyMissions = [...dailyMissions];
    let updatedDaily = false;
    newDailyMissions.forEach(m => {
      if (m.progress < m.target && resultData.item_name.toLowerCase().includes(m.itemStr)) {
        m.progress += 1;
        updatedDaily = true;
        if (m.progress >= m.target) {
          completedAnyMission = true;
          missionBonusPoints += m.points;
          missionBonusExp += (m.exp || m.points);
        }
      }
    });

    if (updatedDaily) {
      setDailyMissions(newDailyMissions);
      localStorage.setItem(`daily_missions_${user.id}`, JSON.stringify(newDailyMissions));
    }

    // Weekly Missions progress
    let newWeeklyMissions = [...weeklyMissions];
    let updatedWeekly = false;
    const catLow = resultData.category ? resultData.category.toLowerCase() : '';
    newWeeklyMissions.forEach(m => {
      if (m.progress < m.target) {
        let match = false;
        if (m.type === 'any') match = true;
        else if (m.type === 'organik' && catLow.includes('organik') && !catLow.includes('anorganik')) match = true;
        else if (m.type === 'anorganik' && catLow.includes('anorganik')) match = true;
        else if (m.type === 'botol' && resultData.item_name.toLowerCase().includes('botol')) match = true;

        if (match) {
          m.progress += 1;
          updatedWeekly = true;
          if (m.progress >= m.target) {
            completedAnyMission = true;
            missionBonusPoints += m.points;
            missionBonusExp += (m.exp || m.points);
          }
        }
      }
    });

    if (updatedWeekly) {
      setWeeklyMissions(newWeeklyMissions);
      localStorage.setItem(`weekly_missions_${user.id}`, JSON.stringify(newWeeklyMissions));
    }

    if (completedAnyMission) {
      const lastCompleted = localStorage.getItem(`last_completed_date_${user.id}`);
      if (lastCompleted !== today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem(`streak_${user.id}`, newStreak.toString());
        localStorage.setItem(`last_completed_date_${user.id}`, today);
        missionBonusPoints += (newStreak * 5); // Streak Bonus
        missionBonusExp += (newStreak * 5);
      }
    }

    let normalSubmitCountVal = parseInt(localStorage.getItem(`normal_submits_today_count_${user.id}`) || '0', 10);
    const normalSubmitDate = localStorage.getItem(`normal_submits_today_date_${user.id}`);
    if (normalSubmitDate !== today) {
        normalSubmitCountVal = 0;
        localStorage.setItem(`normal_submits_today_date_${user.id}`, today);
    }
    
    let basePoints = 5;
    let baseExp = 5;

    if (!completedAnyMission) {
        if (normalSubmitCountVal >= 5) {
            basePoints = 0;
            baseExp = 0;
        } else {
            normalSubmitCountVal += 1;
            localStorage.setItem(`normal_submits_today_count_${user.id}`, normalSubmitCountVal.toString());
            setNormalSubmitCount(normalSubmitCountVal);
        }
    }

    const earnedPoints = basePoints + missionBonusPoints;
    const expGained = baseExp + missionBonusExp;

    if (earnedPoints === 0 && expGained === 0) {
        showToast('Batas harian submit normal tercapai! (Maksimal 5x)', 'warning');
    }
    
    let currentExp = exp + expGained;
    let currentLevel = level;
    let expNeeded = Math.floor(100 * Math.pow(1.5, currentLevel - 1));
    let leveledUp = false;

    while (currentExp >= expNeeded) {
      currentExp -= expNeeded;
      currentLevel += 1;
      leveledUp = true;
      expNeeded = Math.floor(100 * Math.pow(1.5, currentLevel - 1));
    }

    if (leveledUp) {
      setLevel(currentLevel);
      showToast(`Level Up! Kamu sekarang level ${currentLevel}`, 'success');
    }
    setExp(currentExp);
    setPoints(prev => prev + earnedPoints);
    if (!leveledUp) {
      showToast(`Identifikasi berhasil! +${earnedPoints} Poin, +${expGained} EXP`, 'success');
    }

    // Update state & LocalStorage
    const newLog = { ...resultData, date: today, pointsEarned: earnedPoints, expEarned: expGained };
    setHistory(prev => {
      const updatedHistory = [newLog, ...prev];
      if (user && user.id) {
        localStorage.setItem(`history_${user.id}`, JSON.stringify(updatedHistory));
      }
      return updatedHistory;
    });

    // Update DB with points, exp, and level
    if (user && user.id) {
      try {
        const statsRes = await fetch('http://localhost:5000/api/user/update-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, pointsToAdd: earnedPoints, exp: currentExp, level: currentLevel })
        });
        if (statsRes.ok) {
          const data = await statsRes.json();
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (error) {
        console.error('Gagal menyimpan stats ke database:', error);
      }
    } else if (user) {
       const updatedUser = { ...user, points: user.points + earnedPoints, exp: currentExp, level: currentLevel };
       setUser(updatedUser);
       localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

    const [normalSubmitCount, setNormalSubmitCount] = useState(0);

    useEffect(() => {
        if (!user || !user.id) return;
        const today = new Date().toLocaleDateString('id-ID');
        const count = parseInt(localStorage.getItem(`normal_submits_today_count_${user.id}`) || '0', 10);
        const normalSubmitDate = localStorage.getItem(`normal_submits_today_date_${user.id}`);
        if (normalSubmitDate !== today) {
            setNormalSubmitCount(0);
        } else {
            setNormalSubmitCount(count);
        }
    }, [user]);

    const maxNormalSubmits = 5;

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
      history, points, user, token, theme, toggleTheme, login, logout, addHistory, streak,
      dailyMissions, weeklyMissions, exp, level,
      unlockedItems, activeAccessories, buyItem, equipItem, toast, showToast,
      avatar, updateAvatar, normalSubmitCount, maxNormalSubmits, setNormalSubmitCount
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
