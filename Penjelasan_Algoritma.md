# Penjelasan Algoritma: Divide & Conquer (Merge Sort)

Dokumen ini menjelaskan implementasi algoritma **Divide & Conquer** pada aplikasi Eco-Logic. Algoritma spesifik yang digunakan adalah **Merge Sort**.

## 1. Konteks Penggunaan
Algoritma ini diimplementasikan di sisi *Backend* (pada file `backend/controllers/locationController.js`). Fungsinya adalah untuk **mengurutkan daftar lokasi Bank Sampah/TPS dari jarak yang terdekat hingga terjauh** berdasarkan titik koordinat GPS (Latitude & Longitude) pengguna saat ini.

## 2. Kenapa Memilih Divide & Conquer (Merge Sort)?
* **Kinerja Optimal & Stabil:** Merge Sort memiliki kompleksitas waktu **O(N log N)** pada semua kasus (Terbaik, Rata-rata, dan Terburuk). Hal ini membuatnya sangat tangguh. Jika di masa depan database bank sampah berkembang hingga ribuan titik, kecepatan pengurutan tidak akan menurun secara drastis dibandingkan dengan algoritma sederhana seperti *Bubble Sort* atau *Insertion Sort*.
* **Stabil (Stable Sort):** Jika ada dua bank sampah dengan jarak yang sama persis, urutan aslinya tidak akan tertukar.

---

## 3. Cara Kerja Algoritma

Algoritma *Divide & Conquer* bekerja dengan tiga tahapan utama:

### A. Divide (Memecah)
Fungsi akan membelah *array* (daftar lokasi) menjadi dua bagian (kiri dan kanan) tepat di tengah secara terus-menerus (rekursif) hingga setiap bagian hanya memiliki 1 elemen. Array dengan 1 elemen secara otomatis sudah dianggap "terurut".

### B. Conquer (Menaklukkan/Menggabungkan)
Fungsi `merge()` akan mengambil dua bagian yang sudah terurut tersebut, membandingkan atribut `distance` (jarak dalam kilometer), lalu menggabungkannya kembali ke dalam satu *array* baru secara berurutan.

### C. Combine (Menggabungkan Kembali)
Hasil akhir dari penggabungan tersebut akan direturn secara beruntun ke atas hierarki rekursif hingga seluruh *array* utuh kembali namun dalam kondisi yang sudah terurut sempurna dari terdekat ke terjauh.

---

## 4. Potongan Kode Implementasi
Berikut adalah potongan kode algoritma yang berjalan di `locationController.js`:

```javascript
// --- IMPLEMENTASI DIVIDE & CONQUER (MERGE SORT) ---

// 1. Fungsi CONQUER: Menggabungkan dua array yang sudah terurut
const merge = (left, right) => {
  let sortedArray = [];
  let i = 0, j = 0;
  
  // Selama kedua array masih memiliki elemen, bandingkan jaraknya (distance)
  while (i < left.length && j < right.length) {
    if (left[i].distance <= right[j].distance) {
      sortedArray.push(left[i]); // Masukkan yang lebih dekat
      i++;
    } else {
      sortedArray.push(right[j]); // Masukkan yang lebih dekat
      j++;
    }
  }
  
  // Gabungkan sisa elemen yang belum terpindahkan
  return [...sortedArray, ...left.slice(i), ...right.slice(j)];
};

// 2. Fungsi DIVIDE: Memecah array secara rekursif
const mergeSort = (arr) => {
  // Base case: jika array hanya berisi 1 elemen atau kosong, kembalikan
  if (arr.length <= 1) return arr;
  
  // Mencari titik tengah array
  const mid = Math.floor(arr.length / 2);
  
  // Memecah menjadi bagian kiri dan kanan, lalu panggil fungsi ini lagi (Rekursif)
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  // Panggil fungsi Conquer untuk menggabungkan pecahan tersebut
  return merge(left, right);
};

// 3. Eksekusi Pengurutan
locations = mergeSort(locations);
```

## 5. Ringkasan
Dengan mengimplementasikan **Merge Sort**, fitur **Pencarian Lokasi Terdekat** di Eco-Logic tidak hanya fungsional secara matematis (menggunakan formula *Haversine*), tetapi juga diproses secara efisien di sisi server menggunakan pendekatan struktur data dan algoritma standar industri.
