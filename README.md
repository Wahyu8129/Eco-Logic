# Eco-Logic 🌿

**Eco-Logic** adalah aplikasi cerdas berbasis web yang dirancang untuk membantu masyarakat mengidentifikasi jenis sampah dan cara penanganannya secara tepat menggunakan bantuan AI dan sistem informasi geografis (GIS).

Seiring dengan perkembangannya, aplikasi ini kini dilengkapi dengan sistem *backend*, autentikasi pengguna, penyimpanan *database* permanen, serta Asisten AI edukatif.

## 🚀 Fitur Utama (Terbaru)

- **Sistem Autentikasi Pengguna**: Login dan Register untuk menyimpan data progres pengguna secara personal.
- **Penyimpanan Database (Persisten)**: Menyimpan riwayat pembuangan, jumlah poin, dan status penyelesaian misi ke dalam MySQL.
- **Asisten AI EcoBot**: Chatbot pintar (terintegrasi dengan Google Gemini API) yang selalu siap sedia dalam wujud *popup widget* untuk menjawab pertanyaan seputar lingkungan, pengelolaan sampah, dan fitur aplikasi.
- **Identifikasi AI**: Klasifikasi otomatis sampah ke kategori B3, Organik, atau Anorganik.
- **Panduan Penanganan (SOP)**: Instruksi langkah-demi-langkah cara membuang sampah dengan aman.
- **Integrasi GIS**: Menemukan lokasi tempat pembuangan sampah atau bank sampah terdekat berdasarkan radius.
- **Sistem Gamifikasi**: Kumpulkan poin dari setiap aksi peduli lingkungan dan misi harian yang Anda selesaikan.
- **Mode Gelap/Terang (Dark/Light Mode)**: Antarmuka yang nyaman di mata dan dapat disesuaikan dengan preferensi pengguna.

## 💻 Teknologi yang Digunakan

- **Frontend**: React.js, Vite, TailwindCSS (via CSS vanilla/konfigurasi kustom)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **AI Integrasi**: Google Gemini API (untuk EcoBot Chatbot)

## 🛠️ Cara Instalasi & Menjalankan Aplikasi

Karena Eco-Logic kini memiliki *Frontend* dan *Backend* yang berjalan beriringan dengan *Database*, kami telah memisahkan panduan instalasi lengkapnya. 

👉 **[Silakan baca panduan lengkap di file Running.md](Running.md)** untuk instruksi pembuatan database, pengaturan `.env`, serta menjalankan server *frontend* dan *backend* sekaligus.

## 📖 Panduan Penggunaan

### 1. Autentikasi & Dashboard
- Saat pertama kali membuka aplikasi, lakukan **Login** atau **Register** untuk membuat akun baru.
- Setelah masuk, Anda akan diarahkan ke tab **Dashboard** untuk melihat poin terkumpul, statistik aktivitas, dan **Misi Anda Hari Ini**.

### 2. Berinteraksi dengan EcoBot (AI Chatbot)
- Klik ikon *chat* di sudut bawah layar untuk membuka widget **EcoBot**.
- Anda dapat menanyakan tentang cara daur ulang, informasi sampah tertentu, atau penggunaan aplikasi. AI dikhususkan untuk menjawab topik lingkungan saja.

### 3. Identifikasi Sampah
- Masuk ke tab **Identifikasi AI**.
- Ketik nama barang pada kolom pencarian atau gunakan simulasi unggah foto.
- Hasil akan menampilkan kategori sampah, tingkat akurasi AI, SOP pembuangan, dan rute lokasi pembuangan terdekat.

### 4. Mencatat Riwayat Pembuangan
- Setelah membuang sampah, pastikan untuk mencatatnya agar poin Anda bertambah.
- Buka tab **Riwayat** untuk melihat log seluruh aktivitas pembuangan sampah yang telah disinkronkan ke dalam *database*.

---

**Eco-Logic** - *Cerdas Mengelola, Hijaukan Dunia.*
