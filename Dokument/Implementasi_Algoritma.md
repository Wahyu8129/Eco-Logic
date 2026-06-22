# Implementasi Algoritma pada Proyek Eco-Logic

Dokumen ini berisi lampiran potongan kode (*code snippet*) dari algoritma-algoritma utama yang diimplementasikan pada backend aplikasi **Eco-Logic** sebagai referensi pendukung untuk Laporan Analisis Algoritma.

---

## 1. Algoritma Divide and Conquer (Merge Sort)
**Fungsi:** Mengurutkan daftar lokasi pembuangan sampah (Bank Sampah/TPS) berdasarkan jarak terdekat dari pengguna (mulai dari jarak terkecil hingga terbesar).
**Lokasi File:** `backend/controllers/locationController.js`

```javascript
// --- IMPLEMENTASI DIVIDE & CONQUER (MERGE SORT) ---

// 1. Fungsi Conquer: Menggabungkan dua array yang sudah terurut
const merge = (left, right) => {
  let sortedArray = [];
  let i = 0, j = 0;
  
  // Membandingkan elemen dari kedua array dan memasukkannya secara terurut
  while (i < left.length && j < right.length) {
    if (left[i].distance <= right[j].distance) {
      sortedArray.push(left[i]);
      i++;
    } else {
      sortedArray.push(right[j]);
      j++;
    }
  }
  // Memasukkan sisa elemen yang mungkin belum diproses
  return [...sortedArray, ...left.slice(i), ...right.slice(j)];
};

// 2. Fungsi Divide: Memecah array secara rekursif menjadi dua bagian
const mergeSort = (arr) => {
  // Base case: Jika array hanya memiliki 1 atau 0 elemen, maka sudah terurut
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid)); // Memecah bagian kiri
  const right = mergeSort(arr.slice(mid));   // Memecah bagian kanan
  
  // Menggabungkan kembali array yang sudah dipecah menggunakan fungsi merge
  return merge(left, right);
};

// Menerapkan pengurutan pada array locations
locations = mergeSort(locations);
```

---

## 2. Algoritma Greedy
**Fungsi:** Menentukan prioritas pembuangan dari tumpukan sampah pengguna. Sampah yang paling berbahaya (B3) atau yang menghasilkan poin _reward_ tertinggi akan diurutkan untuk dibuang lebih dulu.
**Lokasi File:** `backend/controllers/wasteController.js`

```javascript
// Fungsi Helper untuk menentukan bobot bahaya
const getDangerWeight = (level) => {
  if (level === 'Tinggi') return 3;
  if (level === 'Sedang') return 2;
  if (level === 'Rendah') return 1;
  return 0;
};

// --- IMPLEMENTASI ALGORITMA GREEDY ---
// Pendekatan Greedy: Memilih bobot bahaya tertinggi sebagai prioritas utama. 
// Jika bobot bahaya sama, pilih yang memberikan Poin Reward tertinggi.

const sortedWastes = [...wastes].sort((a, b) => {
  // Fungsi penentuan level bahaya secara lokal
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

  // Greedy Prioritas 1: Bobot Bahaya Tertinggi didahulukan
  if (weightA !== weightB) {
    return weightB - weightA;
  }

  // Greedy Prioritas 2: Jika level bahaya sama, ambil Poin Reward Terbesar
  const pointA = a.pointsEarned || 0;
  const pointB = b.pointsEarned || 0;
  return pointB - pointA;
});
```

---

## 3. Algoritma String Matching (Pencocokan String Dasar)
**Fungsi:** Melakukan komparasi dan pencocokan teks hasil identifikasi gambar dari AI (Computer Vision) dengan _keyword_ (kata kunci) yang terdaftar di database resmi Eco-Logic untuk menampilkan _SOP_ yang paling relevan.
**Lokasi File:** `backend/controllers/aiController.js`

```javascript
// --- IMPLEMENTASI PENGOLAHAN KATA (STRING MATCHING) ---
// Mencocokkan hasil deteksi AI (jsonResult) dengan data sampah di MySQL (categories)

const db = require('../config/db');
const [categories] = await db.execute('SELECT * FROM waste_categories');

// Proses pencocokan (Searching/Matching)
for (const cat of categories) {
    // Normalisasi string (menjadikan huruf kecil) untuk akurasi pencocokan
    const dbName = cat.name.toLowerCase();
    const dbDesc = cat.description.toLowerCase();
    const itemName = jsonResult.item_name.toLowerCase();
    const aiCat = jsonResult.category.toLowerCase();
    
    // String Matching Check: Mengecek apakah nama barang atau kategori dari AI 
    // mengandung kata kunci yang ada pada tabel database
    if (itemName.includes(dbName) || dbDesc.includes(itemName) || aiCat.includes(dbName)) {
        // Jika ditemukan kecocokan, ambil SOP penanganan resmi dari database
        jsonResult.handling_step = `[SOP Resmi Database] ${cat.handling_sop}`;
        
        // Tambahkan tag peringatan jika limbah termasuk kategori berbahaya
        if (cat.danger_level === 'Tinggi') {
            jsonResult.safety_warning = `[BAHAYA TINGGI] ${jsonResult.safety_warning}`;
        }
        break; // Hentikan iterasi segera setelah menemukan kecocokan (efisiensi)
    }
}
```

---

## 4. Algoritma Natural Language Processing (Prompt Engineering & Out-of-Domain Restriction)
**Fungsi:** Membatasi area keahlian (Domain) dari asisten AI (EcoBot) hanya pada topik pengelolaan lingkungan, sampah, dan fitur aplikasi. Jika pengguna membahas topik di luar ini (seperti politik, game, dsb), sistem akan secara otomatis memblokir dan mengarahkan kembali pembicaraan (Out-of-Domain Rejection).
**Lokasi File:** `backend/controllers/aiController.js`

```javascript
// --- IMPLEMENTASI SYSTEM PROMPT & DOMAIN RESTRICTION ---

// System prompt untuk membatasi ruang lingkup bot (EcoBot)
const SYSTEM_PROMPT = `
Anda adalah EcoBot, asisten AI resmi untuk aplikasi Eco-Logic.
Tugas utama Anda adalah mengedukasi pengguna tentang pengelolaan sampah, mengidentifikasi jenis sampah dari gambar, dan menjelaskan fitur-fitur aplikasi Eco-Logic.

ATURAN KETAT YANG HARUS ANDA PATUHI (ALGORITMA REJECTION):
1. BATASAN TOPIK: Anda HANYA boleh merespons percakapan yang berhubungan dengan:
   - Sampah, limbah, daur ulang, dan pengelolaan lingkungan.
   - Pertanyaan seputar fitur aplikasi Eco-Logic (sistem poin, riwayat, lokasi pembuangan).
   - Dampak lingkungan dan gaya hidup ramah lingkungan (go-green).

2. MENOLAK TOPIK LAIN (Out-of-Domain): Jika pengguna menanyakan topik di luar batasan di atas (contoh: politik, hiburan, game, coding, atau hal umum lainnya), Anda HARUS menolak dengan sopan.
   Gunakan kalimat seperti: "Maaf, saya adalah asisten khusus lingkungan Eco-Logic. Saya hanya dapat membantu Anda berdiskusi seputar pengelolaan sampah dan fitur aplikasi ini. Ada yang bisa saya bantu terkait sampah hari ini?"

3. ATURAN GAMBAR (Jika ada): Jika pengguna mengunggah gambar, analisis apakah itu adalah sampah, tempat sampah, atau barang yang berpotensi didaur ulang. 
   Jika gambar tersebut TIDAK relevan (misalnya: foto manusia/selfie, hewan peliharaan, makanan di piring, dsb), tolak dengan halus.
`;

// Integrasi System Prompt ke Generative AI Model
const chatWithAI = async (req, res) => {
    // Memasukkan SYSTEM_PROMPT sebagai systemInstruction agar model mematuhi aturan
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT 
    });

    const result = await model.generateContent(message);
    // Jika user melanggar batas topik, AI akan otomatis membalas sesuai instruksi penolakan di atas
    const response = await result.response;
    const text = response.text();
    // ...
};
```
