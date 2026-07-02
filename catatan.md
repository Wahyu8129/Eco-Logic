# Catatan Penggunaan API & Arsitektur Microservice pada Eco‑Logic
**Frameworks & Teknologi yang Digunakan**

- **Frontend:** React (dengan React Router v6) + Lucide‑react untuk ikon, CSS utility custom (tidak memakai Tailwind).
- **Backend:** Node.js + Express, MySQL (mysql2), dotenv, cors, bcrypt, jsonwebtoken.
- **AI Integration:** Google Gemini API (REST).
- **Build / Dev Tools:** npm scripts, Vite (jika dipakai) atau Create‑React‑App, ESLint, Prettier.
## 1️⃣ REST API pada website ini digunakan untuk apa?

Eco‑Logic memiliki **5 grup utama endpoint** yang melayani kebutuhan front‑end (React) dan integrasi AI:

| Kelompok API | Prefix URL | Fungsi utama |
|--------------|------------|--------------|
| **Auth** | `/api/auth` | Registrasi, login, pembuatan token JWT. |
| **User** | `/api/user` | Menambah/menurunkan poin & EXP, meng‑update profil, mengambil leaderboard, menampilkan statistik admin, meng‑hapus akun (admin). |
| **AI / Eco‑Bot** | `/api/ai` | Menerima gambar sampah, memanggil **Google Gemini** untuk klasifikasi, mengembalikan kategori, poin, EXP, dan saran daur ulang. |
| **Location** | `/api/locations` | Meng‑ambil data bank sampah (latitude/longitude) dari MySQL, melakukan penyortiran jarak (Merge Sort) dan meng‑irimkan ke peta. |
| **Waste** | `/api/waste` | Meng‑ambil referensi jenis‑jenis limbah (kertas, plastik, B3, dsb.). |

**Contoh panggilan:**
```bash
# Login
POST /api/auth/login   {"email":"user@example.com","password":"pwd"}
# Dapatkan leaderboard
GET  /api/user/leaderboard
# Identifikasi sampah lewat Eco‑Bot
POST /api/ai/identify   (multipart/form‑data dengan file gambar)
```

Semua endpoint mengembalikan **JSON** dan dilindungi dengan **CORS** serta **JWT** pada route yang membutuhkan otentikasi.

---

## 2️⃣ Apakah aplikasi ini menggunakan arsitektur microservice?

- **Backend saat ini adalah *monolith* (satu server Node.js/Express).**
  - Semua endpoint (`auth`, `user`, `ai`, `locations`, `waste`) dijalankan pada **port 5000** yang sama.
- **Namun** aplikasi meng‑integrasikan layanan eksternal **Google Gemini AI** lewat `aiRoutes`. 
  - Ini berperan seperti *third‑party microservice*: beban komputasi AI (model besar) dipindahkan ke server Google, bukan dijalankan secara lokal.
- **Kesimpulan untuk presentasi:**
  - *Eco‑Logic* **bukan** microservice *native*; ia adalah aplikasi monolitik dengan **integrasi layanan pihak ketiga** (AI) yang berperilaku seperti microservice.

---

## 3️⃣ Ringkasan cepat untuk dosen
- **REST API**: otentikasi, manajemen pengguna, leaderboard, AI‑bot, lokasi bank sampah, data limbah.
- **Arsitektur**: monolith + panggilan ke **Google Gemini** (third‑party microservice).
- **Keuntungan**: kode simpel, deployment mudah, skalabilitas AI terdelegasi ke Google.

---

*Catatan ini dapat dijadikan referensi saat menjawab pertanyaan dosen tentang API dan arsitektur proyek Eco‑Logic.*
