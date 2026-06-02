# Klikdesa - Portal Layanan Terintegrasi Kabupaten Banjarnegara

Klikdesa adalah platform katalog layanan interaktif dan kolaborasi desa yang dirancang untuk mendigitalisasi tata kelola pemerintahan desa dan meningkatkan keterlibatan masyarakat di seluruh Kabupaten Banjarnegara.

## 🚀 Fitur Utama

- **Integrasi OpenSID**: Agregasi berita dan data statistik dari ratusan desa di Banjarnegara.
- **Layanan Mandiri Digital**: Akses cepat ke dokumen publik, surat online, dan laporan keuangan desa.
- **Sistem Pengaduan (Gadis Desa)**: Platform penegakkan disiplin aparatur desa dengan dukungan unggah bukti multimedia (foto, video, dokumen).
- **Dashboard SDGs**: Visualisasi kemajuan Tujuan Pembangunan Berkelanjutan tingkat desa.
- **Peta Interaktif**: Pemetaan lokasi penting, sarana publik, dan infrastruktur desa.
- **Statistik Real-time**: Data kependudukan dan anggaran yang selalu diperbarui.

## 🛠️ Teknologi

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Shadcn UI
- **Database**: Prisma ORM with MariaDB/PostgreSQL
- **Real-time**: WebSockets & Recharts for data visualization
- **Icons**: Lucide React & Simple Icons

## 🏃 Memulai Pengembangan

1.  **Instalasi Dependensi**:
    ```bash
    npm install
    ```

2.  **Konfigurasi Environment**:
    Salin `.env.example` ke `.env` dan sesuaikan variabel database.

3.  **Jalankan Server Development**:
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di [http://localhost:5091](http://localhost:5091).

4.  **Build untuk Produksi**:
    ```bash
    npm run build
    npm start
    ```

## 📄 Dokumentasi

Detail implementasi dan rencana pengembangan dapat ditemukan di folder `docs/`.

---
© 2026 Dispermades PPKB Kabupaten Banjarnegara & DesaPintar
