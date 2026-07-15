export interface Berita {
    id: number;
    judul: string;
    slug: string;
    ringkasan: string;
    konten: string;
    gambar: string | null;
    kategori: string;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    penulis: string;
    views: number;
}

export interface Pengumuman {
    id: number;
    judul: string;
    konten: string;
    prioritas: string;
    kategori: string;
    status: string;
    publishedAt: string | null;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    penulis: string;
    lampiran: string[];
    views: number;
}

export const mockBerita: Berita[] = [
    {
        id: 1,
        judul: "Peluncuran Portal Web Desa Sijenggung",
        slug: "peluncuran-portal-web-desa-sijenggung",
        ringkasan: "Portal web resmi Desa Sijenggung telah diluncurkan untuk meningkatkan pelayanan masyarakat.",
        konten: "Portal web resmi Desa Sijenggung telah diluncurkan dengan berbagai fitur canggih untuk meningkatkan pelayanan masyarakat...",
        gambar: "/images/berita/portal-launch.jpg",
        kategori: "Teknologi",
        status: "PUBLISHED",
        publishedAt: "2025-10-24T10:00:00Z",
        createdAt: "2025-10-24T09:30:00Z",
        updatedAt: "2025-10-24T10:00:00Z",
        penulis: "Admin Desa",
        views: 150,
    },
    {
        id: 2,
        judul: "Program Pembangunan Infrastruktur Tahun 2025",
        slug: "program-pembangunan-infrastruktur-tahun-2025",
        ringkasan: "Pemerintah Desa Sijenggung mengalokasikan dana untuk pembangunan infrastruktur jalan dan drainase.",
        konten: "Pemerintah Desa Sijenggung dalam tahun anggaran 2025 mengalokasikan dana pembangunan sebesar Rp 2.5 Miliar...",
        gambar: "/images/berita/infrastruktur.jpg",
        kategori: "Pembangunan",
        status: "PUBLISHED",
        publishedAt: "2025-10-23T14:30:00Z",
        createdAt: "2025-10-23T13:00:00Z",
        updatedAt: "2025-10-23T14:30:00Z",
        penulis: "Bagian Pembangunan",
        views: 89,
    },
    {
        id: 3,
        judul: "Vaksinasi COVID-19 Tahap Lanjutan",
        slug: "vaksinasi-covid-19-tahap-lanjutan",
        ringkasan: "Puskesmas Pembantu Desa Sijenggung menyelenggarakan vaksinasi COVID-19 tahap lanjutan.",
        konten: "Puskesmas Pembantu Desa Sijenggung kembali menyelenggarakan vaksinasi COVID-19 tahap lanjutan untuk dosis ketiga...",
        gambar: "/images/berita/vaksinasi.jpg",
        kategori: "Kesehatan",
        status: "PUBLISHED",
        publishedAt: "2025-10-22T08:00:00Z",
        createdAt: "2025-10-21T16:00:00Z",
        updatedAt: "2025-10-22T08:00:00Z",
        penulis: "Bidang Kesehatan",
        views: 234,
    },
];

export const mockPengumuman: Pengumuman[] = [
    {
        id: 1,
        judul: "Libur Nasional dan Cuti Bersama Tahun 2025",
        konten: `Berdasarkan Surat Keputusan Bersama (SKB) Menteri Agama, Menteri Ketenagakerjaan, dan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Nomor 812 Tahun 2024, Nomor 1 Tahun 2024, dan Nomor 3 Tahun 2024 tentang Hari Libur Nasional dan Cuti Bersama Tahun 2025, dengan hormat mengundang seluruh masyarakat Desa Sijenggung untuk memperhatikan jadwal libur nasional dan cuti bersama.

Daftar libur nasional yang akan datang:
- 25 Desember 2025: Hari Raya Natal
- 1 Januari 2026: Tahun Baru 2026

Masyarakat diharapkan memperhatikan jadwal layanan kantor Desa yang disesuaikan dengan hari libur nasional.`,
        prioritas: "TINGGI",
        kategori: "Pemerintahan",
        status: "PUBLISHED",
        publishedAt: "2025-10-24T08:00:00Z",
        expiresAt: "2025-12-31T23:59:59Z",
        createdAt: "2025-10-23T16:00:00Z",
        updatedAt: "2025-10-24T08:00:00Z",
        penulis: "Sekretariat Desa",
        lampiran: ["/pdf/kalender-2025.pdf"],
        views: 45,
    },
    {
        id: 2,
        judul: "Pembayaran PBB dan Retribusi Sampah Triwulan IV",
        konten: `Bersama ini kami sampaikan kepada seluruh wajib Pajak Bumi dan Bangunan (PBB) dan pengguna layanan sampah di Desa Sijenggung bahwa pembayaran PBB dan retribusi sampah untuk Triwulan IV (Oktober-Desember 2025) sudah dapat dilaksanakan.

Pembayaran dapat dilakukan melalui:
1. Kantor Kas Desa Sijenggung (Senin-Jumat, 08:00-14:00 WIB)
2. Mobile Payment (QRIS yang tersedia di kantor Desa)
3. Transfer Bank BPD DIY (No. Rekening: 1234567890)

Batas waktu pembayaran: 20 Desember 2025

Mohon kerjasama dari seluruh warga untuk menyelesaikan kewajiban pembayaran tepat waktu. Terima kasih atas perhatian dan kerjasamanya.`,
        prioritas: "NORMAL",
        kategori: "Keuangan",
        status: "PUBLISHED",
        publishedAt: "2025-10-23T10:00:00Z",
        expiresAt: "2025-12-20T23:59:59Z",
        createdAt: "2025-10-22T15:30:00Z",
        updatedAt: "2025-10-23T10:00:00Z",
        penulis: "Bagian Keuangan",
        lampiran: [],
        views: 28,
    },
    {
        id: 3,
        judul: "Jadwal Vaksinasi COVID-19 Dosis Lanjutan",
        konten: `Dalam rangka meningkatkan imunitas masyarakat Desa Sijenggung, akan diselenggarakan vaksinasi COVID-19 dosis lanjutan (booster) pada:

📅 Jadwal Pelaksanaan:
- Hari: Sabtu, 26 Oktober 2025
- Waktu: 08:00 - 12:00 WIB
- Tempat: Aula Kantor Desa Sijenggung

📋 Persyaratan:
- Warga Desa Sijenggung (dibuktikan dengan KTP/KK)
- Sudah mendapatkan vaksin dosis kedua (minimal 3 bulan yang lalu)
- Membawa kartu vaksin atau bukti vaksinasi dosis kedua
- Sehat dan tidak demam
- Membawa alat tulis

📞 Informasi lebih lanjut:
- Kontak: 08123456789 (Bidan Desa)
- WhatsApp: 08123456789

Pelayanan gratis dan terbuka untuk seluruh warga yang memenuhi persyaratan. Mari kita bersama-sama menjaga kesehatan diri dan keluarga.`,
        prioritas: "NORMAL",
        kategori: "Kesehatan",
        status: "PUBLISHED",
        publishedAt: "2025-10-22T14:00:00Z",
        expiresAt: "2025-10-26T12:00:00Z",
        createdAt: "2025-10-21T11:00:00Z",
        updatedAt: "2025-10-22T14:00:00Z",
        penulis: "Bidang Kesehatan",
        lampiran: ["/pdf/formulir-vaksin.pdf"],
        views: 67,
    },
    {
        id: 4,
        judul: "⚠️ Darurat: Gangguan Air Bersih",
        konten: `Mohon maaf kepada seluruh warga Desa Sijenggung, saat ini terjadi gangguan pada sistem distribusi air bersih di wilayah RT 01, RT 02, dan RT 03.

🚨 Lokasi Terdampak:
- RT 01/RW 01 Dusun Sijenggung
- RT 02/RW 01 Dusun Sijenggung
- RT 03/RW 01 Dusun Sijenggung

⏰ Perkiraan Waktu Perbaikan:
- Mulai: 24 Oktober 2025, 14:00 WIB
- Selesai: 24 Oktober 2025, 20:00 WIB

🔧 Penyebab: Perbaikan pipa distribusi utama di Jl. Raya Desa Sijenggung

📞 Kontak Darurat:
- PDAM Cabang Sleman: (0274) 123456
- Kantor Desa: (0274) 654321

Mohon kesabaran dan pengertian dari seluruh warga. Tim teknisi sedang bekerja keras untuk menyelesaikan masalah ini sesegera mungkin.`,
        prioritas: "PENTING",
        kategori: "Layanan Umum",
        status: "PUBLISHED",
        publishedAt: "2025-10-24T14:00:00Z",
        expiresAt: "2025-10-24T20:00:00Z",
        createdAt: "2025-10-24T14:00:00Z",
        updatedAt: "2025-10-24T14:00:00Z",
        penulis: "Admin Desa",
        lampiran: [],
        views: 156,
    },
];
