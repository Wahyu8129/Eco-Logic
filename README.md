# Eco-Logic 🌿

**Eco-Logic** adalah aplikasi cerdas berbasis web yang dirancang untuk membantu masyarakat mengidentifikasi jenis sampah dan cara penanganannya secara tepat menggunakan bantuan AI dan sistem informasi geografis (GIS).

> **🚧 Status Proyek (Work In Progress)**: Aplikasi ini saat ini masih dalam tahap pengembangan aktif (WIP). Beberapa fitur mungkin belum berfungsi sepenuhnya atau masih berupa simulasi.

## 🚀 Fitur Utama

- **Identifikasi AI**: Klasifikasi otomatis sampah ke kategori B3, Organik, atau Anorganik. *(Simulasi / WIP)*
- **Panduan Penanganan (SOP)**: Instruksi langkah-demi-langkah cara membuang sampah dengan aman.
- **Integrasi GIS**: Menemukan lokasi tempat pembuangan sampah atau bank sampah terdekat berdasarkan radius. *(Simulasi / WIP)*
- **Sistem Gamifikasi**: Kumpulkan poin dari setiap aksi peduli lingkungan yang Anda lakukan. *(WIP)*
- **Riwayat Aktivitas**: Pantau kontribusi Anda dalam menjaga kebersihan lingkungan. *(WIP)*

## 🛠️ Cara Instalasi

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di perangkat Anda.

1.  **Clone Repository**
    ```bash
    git clone https://github.com/Wahyu8129/Eco-Logic.git
    cd Eco-Logic
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Jalankan Aplikasi (Mode Development)**
    ```bash
    npm run dev
    ```

4.  **Buka di Browser**
    Akses aplikasi di: `http://localhost:5173/`

## 📖 Cara Penggunaan Aplikasi

### 1. Identifikasi Sampah
- Masuk ke tab **Identifikasi AI**.
- Ketik nama barang pada kolom pencarian (contoh: "Baterai", "Botol plastik", atau "Lampu").
- Klik tombol **Analisis** atau tekan Enter.
- **Opsi Foto**: Klik area "Ambil Foto / Unggah Gambar" untuk melakukan simulasi unggah foto.
- Hasil akan menampilkan kategori sampah, tingkat akurasi AI, SOP pembuangan, dan lokasi pembuangan terdekat.

### 2. Mencari Lokasi Pembuangan
- Setelah identifikasi berhasil, lihat bagian **Lokasi Pembuangan Terdekat**.
- Klik **Arahkan Rute** pada lokasi yang diinginkan untuk mendapatkan petunjuk arah.

### 3. Dashboard & Statistik
- Buka tab **Dashboard** untuk melihat total aksi peduli yang telah Anda lakukan, jumlah limbah B3 yang diselamatkan, dan total poin terkumpul.
- Cek bagian **Misi Anda Hari Ini** untuk melihat tugas harian yang bisa memberikan poin tambahan.

### 4. Riwayat Pembuangan
- Buka tab **Riwayat** untuk melihat log aktivitas pembuangan sampah yang telah Anda catat sebelumnya.

---

**Eco-Logic** - *Cerdas Mengelola, Hijaukan Dunia.*
