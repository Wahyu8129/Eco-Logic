# Panduan Menjalankan Aplikasi Eco-Logic

Dokumen ini berisi panduan lengkap untuk menjalankan aplikasi **Eco-Logic** (Frontend & Backend) beserta konfigurasi databasenya dari awal hingga akhir.

## 1. Persiapan Database (MySQL)

Aplikasi ini menggunakan MySQL sebagai database. Pastikan MySQL (misalnya melalui XAMPP, WAMP, atau MySQL Server) sudah terinstal dan berjalan.

1. Buka MySQL client (seperti phpMyAdmin atau MySQL Workbench).
2. Buat database baru dengan nama `eco_logic_db` (atau sesuai konfigurasi Anda).
   ```sql
   CREATE DATABASE eco_logic_db;
   ```
3. Import file struktur database yang telah disediakan di folder backend:
   - File: `backend/database.sql`
   - Import file ini ke dalam database `eco_logic_db` yang baru saja dibuat. File ini akan membuat semua tabel yang dibutuhkan oleh aplikasi (seperti tabel `users`, dll).

## 2. Persiapan Environment Variables (.env)

Aplikasi membutuhkan file konfigurasi environment untuk berjalan, terutama di bagian backend.

1. Masuk ke folder `backend`.
2. Buat file bernama `.env` jika belum ada, atau sesuaikan file yang sudah ada.
3. Isi file `backend/.env` dengan konfigurasi berikut:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root  # Sesuaikan dengan password database Anda (kosongkan jika tidak ada password)
   DB_NAME=eco_logic_db
   GEMINI_API_KEY=your_gemini_api_key_here # Ganti dengan API Key Gemini Anda jika fitur chatbot digunakan
   ```

## 3. Instalasi Dependencies (Library)

Anda perlu menginstal dependencies untuk *Frontend* dan *Backend* melalui terminal/command prompt. Pastikan Anda sudah menginstal **Node.js** di komputer Anda.

Buka terminal di **folder utama proyek (root direktori Eco-Logic)**, lalu jalankan perintah berikut secara berurutan:

1. **Install dependencies Frontend (root):**
   ```bash
   npm install
   ```

2. **Install dependencies Backend:**
   Masuk ke folder backend lalu jalankan instalasi:
   ```bash
   cd backend
   npm install
   ```
   Setelah selesai, kembali ke folder utama:
   ```bash
   cd ..
   ```

## 4. Menjalankan Aplikasi

Aplikasi Eco-Logic sudah dikonfigurasi menggunakan script `concurrently`, sehingga Anda bisa menjalankan Frontend (Vite) dan Backend (Express) secara bersamaan hanya dengan satu perintah dari folder utama.

1. Buka terminal di **folder utama proyek**.
2. Jalankan perintah berikut:
   ```bash
   npm run start:all
   ```

**Penjelasan:**
- Perintah ini akan menjalankan **Backend** (Node.js/Express) pada `http://localhost:5000`.
- Perintah ini juga akan menjalankan **Frontend** (Vite/React) pada URL lokal yang biasanya adalah `http://localhost:5173`.
- Terminal akan menampilkan log dari kedua proses tersebut secara bersamaan.

## 5. Mengakses Aplikasi

Setelah aplikasi berjalan:
1. Buka browser (Chrome, Firefox, dll).
2. Akses alamat Frontend: `http://localhost:5173` (atau sesuai dengan URL yang tertera di terminal Vite).
3. Aplikasi Eco-Logic sekarang siap digunakan.

---

### Troubleshooting (Jika Terjadi Masalah)

- **Port Conflict (Port sudah digunakan):** Jika port `5000` (untuk backend) atau port `5173` (untuk frontend) sudah digunakan oleh aplikasi lain, ubah port di file `.env` (backend) atau hentikan aplikasi yang menggunakan port tersebut.
- **Koneksi Database Gagal (Access Denied):** Pastikan `DB_USER` dan `DB_PASSWORD` di dalam file `backend/.env` sudah benar sesuai dengan konfigurasi server MySQL Anda (contoh XAMPP defaultnya user `root` tanpa password).
- **Modul Tidak Ditemukan (Cannot find module):** Pastikan Anda telah menjalankan `npm install` baik di folder utama maupun di dalam folder `backend`.
