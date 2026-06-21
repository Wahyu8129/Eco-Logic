# Rencana Pengembangan (Development Plan) - Eco-Logic 🌿

Dokumen ini merangkum peta jalan (roadmap) pengembangan aplikasi **Eco-Logic** dari tahap *mock-up/prototype* saat ini menuju aplikasi *full-stack* yang sepenuhnya fungsional.

---

## 🎯 Fase 1: Arsitektur Frontend & Refactoring (Minggu 1)
Fokus pada restrukturisasi kode agar lebih *scalable* dan mudah dikelola sebelum logika yang lebih kompleks ditambahkan.

*   [x] **Routing**: Implementasi `react-router-dom` untuk memisahkan tab menjadi halaman mandiri (`/`, `/identify`, `/history`). ✅
*   [x] **Struktur Folder**: Memecah `App.jsx` yang besar menjadi komponen-komponen kecil yang *reusable*. ✅
    *   `src/components/` (Card, Button, Header, dll.)
    *   `src/pages/` (Dashboard, Identify, History)
    *   `src/utils/` (Helper functions)
*   [x] **State Management**: Context API diimplementasikan di `src/context/AppContext.jsx` untuk mengelola Poin dan Riwayat secara global. ✅

---

## ⚙️ Fase 2: Backend & Desain Database (Minggu 2)
Membangun pondasi data untuk menggantikan `mockDatabase`.

*   [x] **Pemilihan Stack Backend**: Menggunakan **Custom Backend** dan database **MySQL** (karena menggunakan flyenv environment). Bahasa/Framework backend akan ditentukan (contoh: Node.js/Express atau PHP).
*   [x] **Desain Skema Database (ERD)**:
    *   `Users`: Menyimpan profil, saldo poin, dan kredensial.
    *   `Waste_Categories`: Menyimpan SOP penanganan, bahaya, dan poin *reward*.
    *   `Disposal_Locations`: Menyimpan koordinat (Latitude/Longitude) bank sampah.
    *   `Activity_Logs`: Mencatat riwayat pembuangan/identifikasi pengguna.
*   [x] **Autentikasi (Auth)**: Membuat fitur Login dan Register pengguna.

---

## 🧠 Fase 3: Integrasi AI & Pemrosesan Gambar (Minggu 3)
Mengganti simulasi *timeout* dengan klasifikasi cerdas sungguhan.

*   [x] **Fitur Upload Gambar Asli**: Mengubah simulasi "Ambil Foto" menjadi input file atau akses kamera langsung menggunakan HTML5 API.
*   [x] **Pemilihan Model AI/Computer Vision**:
    *   *Opsi 1 (Mudah)*: Menggunakan Cloud API pihak ketiga (Google Cloud Vision API atau OpenAI GPT-4o Vision). [TERPILIH: Gemini 2.5 Flash]
    *   *Opsi 2 (Mandiri)*: Menggunakan **TensorFlow.js** untuk klasifikasi langsung di browser (Client-side) atau melatih model sederhana (Teachable Machine/Keras) dan menaruhnya di backend (Server-side).
*   [x] **Pencocokan Data**: Menghubungkan hasil prediksi AI dengan SOP penanganan yang ada di database.
*   [x] **Chat AI Edukasi (EcoBot)**: Mengintegrasikan asisten AI (menggunakan **Google Gemini API** atau **Groq API**) agar pengguna dapat bertanya seputar sampah. Menggunakan *System Prompt* ketat untuk memastikan AI tetap relevan pada topik lingkungan dan fitur Eco-Logic.

---

## 🗺️ Fase 4: Integrasi GIS & Geolocation (Minggu 4)
Menampilkan lokasi pembuangan nyata berdasarkan posisi pengguna.

*   [x] **Layanan Peta (Map Service)**: Mengintegrasikan **Leaflet.js/OpenStreetMap** (Gratis) atau **Google Maps API/Mapbox** ke dalam frontend.
*   [x] **Deteksi Lokasi Pengguna**: Meminta izin lokasi (`navigator.geolocation`) dari perangkat pengguna.
*   [x] **Kueri Radius (Spatial Query)**: Menghitung jarak pengguna ke titik pembuangan (menggunakan rumus Haversine atau fitur PostGIS di database) dan menampilkan rute terdekat.

---

## 🎮 Fase 5: Gamifikasi & Polish UX (Minggu 5)
Meningkatkan interaksi (engagement) pengguna.

*   [ ] **Sistem Poin Dinamis**: Memberikan poin riil yang tersimpan di database setiap kali pengguna berhasil membuang sampah sesuai arahan.
*   [ ] **Leaderboard / Misi**: Menambahkan halaman peringkat (siapa yang paling peduli lingkungan) dan mengaktifkan sistem "Misi Harian".
*   [ ] **Micro-animations**: Menambahkan feedback visual (toast notifications) ketika pengguna mendapatkan poin atau hasil identifikasi berhasil.

---

## 🚀 Fase 6: Testing & Deployment (Minggu 6)

*   [ ] **Testing**: Melakukan pengujian integrasi (memastikan AI dan Peta berjalan baik).
*   [ ] **Frontend Deployment**: Hosting aplikasi React/Vite ke **Vercel** atau **Netlify**.
*   [ ] **Backend/Database Deployment**: Hosting backend dan database ke layanan cloud (Supabase, Render, atau Railway).
*   [ ] **Dokumentasi Akhir**: Memperbarui README dan dokumentasi API.
