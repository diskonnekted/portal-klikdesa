import { Suspense } from "react";
import { HomePageClient } from "./HomePageClient";
import { getServerTranslation } from "@/lib/server-translation";

// Generate data di server side untuk menghindari hydration issues
function getServerSideData() {
    return {
        heroSlides: [
            {
                id: "1",
                title: getServerTranslation("hero.judul1"),
                description: getServerTranslation("hero.deskripsi1"),
                image: "/uploads/sliders/desa.avif",
                ctaText: getServerTranslation("hero.ctaLayananDigital"),
                ctaLink: "/layanan",
            },
            {
                id: "2",
                title: "Pembangunan Infrastruktur",
                description: "Meningkatkan kualitas sarana dan prasarana desa",
                image: "/uploads/sliders/sawah-1.avif",
                ctaText: getServerTranslation("hero.ctaPantauPembangunan"),
                ctaLink: "/pembangunan",
            },
            {
                id: "3",
                title: "Pemberdayaan Masyarakat",
                description: "Meningkatkan Kesejahteraan Warga Melalui Program Ekonomi",
                image: "/uploads/sliders/peternakan.avif",
                ctaText: getServerTranslation("hero.ctaHubungiKami"),
                ctaLink: "/pengaduan",
            },
            {
                id: "4",
                title: "Pelestarian Budaya",
                description: "Melestarikan seni dan budaya lokal Sijenggung",
                image: "/uploads/sliders/taman.avif",
                ctaText: getServerTranslation("hero.ctaDownloadAplikasi"),
                ctaLink: "/aplikasi",
            },
            {
                id: "5",
                title: "Inovasi Pelayanan",
                description: "Teknologi untuk kemajuan desa yang lebih baik",
                image: "/uploads/sliders/sawah-2.avif",
                ctaText: getServerTranslation("hero.ctaLihatBerita"),
                ctaLink: "/berita",
            },
        ],

        quickLinks: [
            {
                icon: "FileText",
                label: getServerTranslation("quickLinks.dokumenPublik"),
                description: getServerTranslation("quickLinks.dokumenPublikDesk"),
                href: "#",
                color: "bg-primary",
            },
            {
                icon: "FileText",
                label: getServerTranslation("quickLinks.suratOnline"),
                description: getServerTranslation("quickLinks.suratOnlineDesk"),
                href: "#",
                color: "bg-tertiary",
            },
            {
                icon: "FileChartPie",
                label: getServerTranslation("quickLinks.laporanOnline"),
                description: getServerTranslation("quickLinks.laporanOnlineDesk"),
                href: "#",
                color: "bg-secondary-900",
            },
            {
                icon: "DollarSign",
                label: getServerTranslation("quickLinks.keuanganDesa"),
                description: getServerTranslation("quickLinks.keuanganDesaDesk"),
                href: "/keuangan",
                color: "bg-tertiary-900",
            },
            {
                icon: "Heart",
                label: getServerTranslation("quickLinks.kesehatan"),
                description: getServerTranslation("quickLinks.kesehatanDesk"),
                href: "/statistik/penyakit",
                color: "bg-secondary-600",
            },
            {
                icon: "GraduationCap",
                label: getServerTranslation("quickLinks.pendidikan"),
                description: getServerTranslation("quickLinks.pendidikanDesk"),
                href: "/statistik/pendidikan",
                color: "bg-tertiary-600",
            },
            {
                icon: "Building",
                label: getServerTranslation("quickLinks.pembangunan"),
                description: getServerTranslation("quickLinks.pembangunanDesk"),
                href: "/pembangunan",
                color: "bg-secondary-700",
            },
            {
                icon: "ChartNoAxesColumnDecreasing",
                label: getServerTranslation("quickLinks.indexDesaMandiri"),
                description: getServerTranslation("quickLinks.indexDesaMandiriDesk"),
                href: "/idm",
                color: "bg-secondary-800",
            },
            {
                icon: "Vote",
                label: getServerTranslation("quickLinks.eVoting"),
                description: getServerTranslation("quickLinks.eVotingDesk"),
                href: "/sdgs",
                color: "bg-secondary-900",
            },
            {
                icon: "Phone",
                label: getServerTranslation("quickLinks.kontakDarurat"),
                description: getServerTranslation("quickLinks.kontakDaruratDesk"),
                href: "/pengaduan",
                color: "bg-tertiary-900",
            },
        ],

        // Data pengumuman
        pengumuman: [
            {
                id: 1,
                judul: "Pemadaman Listrik Terjadwal",
                prioritas: "tinggi",
                konten: "Akan ada pemadaman listrik pada hari Sabtu, 15 November 2025 pukul 09:00-17:00 WIB untuk pemeliharaan rutin.",
            },
            {
                id: 2,
                judul: "Jadwal Imunisasi Balita",
                prioritas: "normal",
                konten: "Posyandu akan menyelenggarakan imunisasi balita pada hari Senin, 17 November 2025 di Balai Desa.",
            },
            {
                id: 3,
                judul: "Pembagian Bantuan Beras",
                prioritas: "penting",
                konten: "Akan diadakan pembagian bantuan beras untuk warga yang kurang mampu di balai Desa.",
            },
            {
                id: 4,
                judul: "Pengumuman Pemenang Lomba Desa",
                prioritas: "normal",
                konten: "Pengumuman pemenang lomba Desa dalam rangka HUT Desa Sijenggung ke-125.",
            },
            {
                id: 5,
                judul: "Pembayaran PBB Tahun 2025",
                prioritas: "penting",
                konten: "Batas waktu pembayaran PBB tahun 2025 sampai dengan 31 Desember 2025.",
            },
            {
                id: 6,
                judul: "Pembayaran PBB Tahun 2026",
                prioritas: "penting",
                konten: "Batas waktu pembayaran PBB tahun 2026 sampai dengan 31 Desember 2026.",
            },
            {
                id: 7,
                judul: "Pembayaran PBB Tahun 2027",
                prioritas: "penting",
                konten: "Batas waktu pembayaran PBB tahun 2027 sampai dengan 31 Desember 2027.",
            },
            {
                id: 8,
                judul: "Pembayaran PBB Tahun 2027",
                prioritas: "penting",
                konten: "Batas waktu pembayaran PBB tahun 2027 sampai dengan 31 Desember 2027.",
            },
            {
                id: 9,
                judul: "Pembayaran PBB Tahun 2027",
                prioritas: "penting",
                konten: "Batas waktu pembayaran PBB tahun 2027 sampai dengan 31 Desember 2027.",
            },
            {
                id: 10,
                judul: "Pembayaran PBB Tahun 2027",
                prioritas: "penting",
                konten: "Batas waktu pembayaran PBB tahun 2027 sampai dengan 31 Desember 2027.",
            },
        ],

        // Data kegiatan - tanggal statis untuk menghindari hydration issues
        events: [
            {
                id: 1,
                nama: "Rapat PKK Desa",
                tanggal: "2025-01-08T09:00:00.000Z",
                waktu: "09:00",
                lokasi: "Balai Desa",
                kategori: "Pemerintahan",
            },
            {
                id: 2,
                nama: "Kegiatan Posyandu",
                tanggal: "2025-01-09T08:00:00.000Z",
                waktu: "08:00",
                lokasi: "Posyandu Melati",
                kategori: "Kesehatan",
            },
            {
                id: 3,
                nama: "Lomba Senam Pagi",
                tanggal: "2025-01-11T06:30:00.000Z",
                waktu: "06:30",
                lokasi: "Lapangan Desa",
                kategori: "Olahraga",
            },
            {
                id: 4,
                nama: "Lomba Senam Pagi",
                tanggal: "2025-01-11T06:30:00.000Z",
                waktu: "06:30",
                lokasi: "Lapangan Desa",
                kategori: "Olahraga",
            },
        ],
    };
}

export default function Home() {
    const serverData = getServerSideData();

    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">{getServerTranslation("messages.loading")}</p>
                    </div>
                </div>
            }
        >
            <HomePageClient serverData={serverData} />
        </Suspense>
    );
}

