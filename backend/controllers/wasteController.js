const db = require('../config/db');

// Fungsi Helper untuk bobot bahaya
const getDangerWeight = (level) => {
  if (level === 'Tinggi') return 3;
  if (level === 'Sedang') return 2;
  if (level === 'Rendah') return 1;
  return 0;
};

// --- IMPLEMENTASI ALGORITMA GREEDY ---
exports.getWastePriority = async (req, res) => {
  try {
    const { wastes } = req.body;
    
    if (!wastes || !Array.isArray(wastes)) {
      return res.status(400).json({ message: 'wastes array is required' });
    }

    // Algoritma Greedy untuk menentukan prioritas pembuangan
    // 1. Ambil bobot dari category/danger level (jika kategori mengandung kata B3, anggap tinggi)
    // Di real-world, kita query ke database untuk danger_level tiap waste_category.
    // Namun untuk implementasi langsung pada history array:
    
    const sortedWastes = [...wastes].sort((a, b) => {
      // Kita asumsikan kategori yang mengandung 'B3' itu berbahaya (Tinggi = 3)
      // Anorganik (Sedang = 2), Organik (Rendah = 1)
      const determineLevel = (category) => {
        const cat = (category || '').toLowerCase();
        if (cat.includes('b3')) return 'Tinggi';
        if (cat.includes('anorganik')) return 'Sedang';
        return 'Rendah';
      };

      const levelA = determineLevel(a.category);
      const levelB = determineLevel(b.category);

      const weightA = getDangerWeight(levelA);
      const weightB = getDangerWeight(levelB);

      // Greedy Prioritas 1: Bobot Bahaya Tertinggi
      if (weightA !== weightB) {
        return weightB - weightA;
      }

      // Greedy Prioritas 2: Poin Reward Terbesar
      const pointA = a.pointsEarned || 0;
      const pointB = b.pointsEarned || 0;
      return pointB - pointA;
    });

    res.json({
      message: 'Waste priority calculated successfully using Greedy algorithm',
      data: sortedWastes
    });
  } catch (error) {
    console.error('Waste priority error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
