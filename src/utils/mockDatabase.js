// --- MOCK DATABASE ---
// Data ini akan digantikan oleh panggilan API ke backend nyata di Fase 2
export const mockDatabase = {
  "baterai": {
    item_name: "Baterai Bekas",
    category: "B3 (Bahan Berbahaya)",
    confidence_score: 98.5,
    handling_step: "Jangan dibuang ke tempat sampah biasa. Bungkus dengan plastik bening yang kering, pisahkan dari sampah lain untuk mencegah korsleting atau kebocoran bahan kimia.",
    safety_warning: "Tinggi - Mengandung logam berat (Lithium/Alkaline).",
    recyclability: "Khusus",
    locations: [
      { name: "E-Waste Dropbox Balaikota", distance: 1.2, status_open: true },
      { name: "Bank Sampah Elektronik Jaya", distance: 3.5, status_open: true }
    ]
  },
  "lampu": {
    item_name: "Lampu Neon/Bohlam",
    category: "B3 (Bahan Berbahaya)",
    confidence_score: 95.2,
    handling_step: "Gunakan sarung tangan. Jika pecah, hindari menghirup uapnya (mengandung merkuri). Masukkan ke dalam wadah tertutup rapat atau kardus aslinya.",
    safety_warning: "Tinggi - Mengandung merkuri dan pecahan kaca.",
    recyclability: "Khusus",
    locations: [
      { name: "Kantor Dinas Lingkungan Hidup", distance: 2.0, status_open: true },
      { name: "E-Waste Dropbox Balaikota", distance: 4.1, status_open: true }
    ]
  },
  "botol": {
    item_name: "Botol Plastik PET",
    category: "Anorganik",
    confidence_score: 99.1,
    handling_step: "Kosongkan isi botol, cuci bersih, lepaskan label jika memungkinkan, lalu remukkan botol untuk menghemat ruang sebelum dibuang ke tong sampah biru.",
    safety_warning: "Rendah - Aman ditangani langsung.",
    recyclability: "Tinggi (Dapat didaur ulang penuh)",
    locations: [
      { name: "Bank Sampah Hijau Berseri", distance: 0.8, status_open: true },
      { name: "Pengepul Daur Ulang Mandiri", distance: 1.5, status_open: true }
    ]
  },
  "apel": {
    item_name: "Sisa Makanan (Apel)",
    category: "Organik",
    confidence_score: 96.8,
    handling_step: "Masukkan ke dalam komposter atau lubang biopori. Jika dibuang ke tempat sampah umum, pastikan wadah tertutup agar tidak mengundang hama.",
    safety_warning: "Rendah - Mudah membusuk.",
    recyclability: "Kompos",
    locations: [
      { name: "Fasilitas Kompos RT 04", distance: 0.3, status_open: true },
      { name: "TPA Sementara Desa", distance: 2.1, status_open: true }
    ]
  }
};

/**
 * Fungsi simulasi AI - mencari keyword dari input teks ke mockDatabase.
 * Akan digantikan oleh panggilan ke Vision AI API di Fase 3.
 * @param {string} keyword - Teks input dari pengguna
 * @returns {object} - Hasil identifikasi sampah
 */
export const simulateAIAnalysis = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  for (const key in mockDatabase) {
    if (lowerKeyword.includes(key)) {
      return mockDatabase[key];
    }
  }
  // Fallback jika tidak ditemukan
  return {
    item_name: "Material Tidak Dikenal",
    category: "Unknown",
    confidence_score: 45.0,
    handling_step: "Kami tidak dapat mengidentifikasi sampah ini. Harap pisahkan dan hubungi petugas kebersihan setempat.",
    safety_warning: "Tidak diketahui - Tangani dengan hati-hati.",
    recyclability: "Tidak diketahui",
    locations: []
  };
};

export const RANDOM_ITEMS = ["Baterai", "Botol", "Lampu", "Apel"];
