# Skin Snap API
## 📋 Persyaratan
Sebelum memulai, pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18+ disarankan)
- [PostgreSQL](https://www.postgresql.org/download/) (versi 14+ disarankan)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)

---

## 🚀 Cara Menjalankan

1. **Clone repository**
   ```bash
   git clone https://github.com/username/skin-snap-api.git
   cd skin-snap-api
   ```

2. **Siapkan database PostgreSQL**
   - Buat database dengan nama:
     ```
     db_skin_snap
     ```

3. **Salin file environment**
   ```bash
   cp .env.example .env
   ```
   Lalu sesuaikan konfigurasi pada `.env` dengan kredensial PostgreSQL Anda.

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Migrasi database**
   ```bash
   npx prisma migrate dev
   ```

7. **Jalankan server**
   ```bash
   npm run dev
   ```

---

## 🔗 Menghubungkan dengan Skin Snap Frontend
Pastikan Skin Snap Frontend sudah dikonfigurasi agar mengarah ke endpoint API ini.  
Contoh:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```
Sesuaikan dengan URL backend Anda.

---

## 📂 Struktur Folder

```plaintext
.
├── prisma/                # Skema dan migrasi Prisma ORM
├── src/
│   ├── config/            # Konfigurasi aplikasi (DB, env, dsb)
│   ├── controllers/       # Controller untuk menangani request/response
│   ├── middlewares/       # Middleware Express (auth, error handler, dll)
│   ├── prisma/            # Inisialisasi Prisma Client
│   ├── routes/            # Definisi routing API
│   ├── services/          # Business logic / service layer
│   ├── types/             # Definisi tipe TypeScript
│   ├── utils/             # Helper & utility functions
│   ├── app.ts             # Setup dan konfigurasi Express app
│   └── server.ts          # Entry point server
├── .env                   # Konfigurasi environment
├── .gitignore             # File & folder yang diabaikan Git
├── package.json           # Daftar dependencies dan script
├── tsconfig.json          # Konfigurasi TypeScript
```

---

## 📜 Lisensi
Proyek ini menggunakan lisensi **MIT**. Silakan gunakan dan modifikasi sesuai kebutuhan.

```

