"use client";

import React from "react";
import Link from "next/link";
import {
    FileText,
    Download,
    Heart,
    Timer,
    MapPin,
    Calendar,
    DollarSign,
    Phone,
    ChevronRight,
    Bell,
    Building,
    Building2,
    Globe,
    Server,
    GraduationCap,
    ChartNoAxesColumnDecreasing,
    Clock,
    Newspaper,
    Eye,
    NotebookPen,
    BriefcaseBusiness,
    Lightbulb,
    AlertTriangle,
    Users,
} from "lucide-react";

import ImageFallback from "@/components/ui/custom/ImageFallback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomButton } from "@/components/ui/custom/CustomButton";
import { WeatherCard } from "@/components/ui/custom/WeatherCard";
import { DecorativeSeparator } from "@/components/ui/custom/DecorativeSeparator";
import { ClasnetStatistik } from '@/components/ui/custom/ClasnetStatistik';
import { OpenSIDStatsDisplay } from "@/components/ui/custom/OpenSIDStatsDisplay";
import { useExternalNews } from "@/hooks/useExternalNews";
import { useTranslation } from "@/lib/useTranslation";
import { EventDate } from "@/components/EventDate";

interface ServerData {
    heroSlides: Array<{
        id: string;
        title: string;
        description: string;
        image: string;
        ctaText: string;
        ctaLink: string;
    }>;
    quickLinks: Array<{
        icon: string;
        label: string;
        description: string;
        href: string;
        color: string;
    }>;
    pengumuman: Array<{
        id: number;
        judul: string;
        prioritas: string;
        konten: string;
    }>;
    events: Array<{
        id: number;
        nama: string;
        tanggal: string;
        waktu: string;
        lokasi: string;
        kategori: string;
    }>;
}

// Icon mapping untuk quickLinks
const iconMap: { [key: string]: React.ComponentType<{ className?: string; size?: number | string }> } = {
    FileText,
    DollarSign,
    Heart,
    GraduationCap,
    Building,
    ChartNoAxesColumnDecreasing,
    Phone,
    Download,
};

export function HomePageClient({ serverData }: { serverData: ServerData }) {
    const { t } = useTranslation();
    const { news: externalNews, loading: newsLoading, error: newsError } = useExternalNews(20);

    // Transform quickLinks dengan proper icons
    const quickLinks = serverData.quickLinks.map((link) => ({
        ...link,
        icon: iconMap[link.icon] || FileText,
        svg: getSvgPath(link.icon, link.label),
    }));

    // Get SVG path based on icon or label
    function getSvgPath(icon: string, label: string): string {
        const iconToSvg: { [key: string]: string } = {
            FileText: label.toLowerCase().includes("surat") ? "surat.svg" : "dokumen.svg",
            FileChartPie: "laporan.svg",
            DollarSign: "keuangan.svg",
            Heart: "kesehatan.svg",
            GraduationCap: "pendidikan.svg",
            Building: "pembangunan.svg",
            Phone: "kontak.svg",
            ChartNoAxesColumnDecreasing: "idm.svg",
        };
        return `/images/layanan-cepat/${iconToSvg[icon] || "dokumen.svg"}`;
    }

    // Transform data berita
    const transformNewsData = (newsData: typeof externalNews) => {
        if (!newsData || newsData.length === 0 || newsError) {
            return null;
        }

        // Berita terbaru
        const firstNews = newsData[0]; // Berita terbaru
        const otherNews = newsData.slice(1, 8); // 8 berita selanjutnya

        return {
            beritaUtama: {
                id: firstNews.id,
                slug: firstNews.slug,
                judul: firstNews.title,
                ringkasan: firstNews.excerpt,
                gambar: firstNews.featuredImage,
                kategori: firstNews.category,
                author: firstNews.author.name,
                views: firstNews.viewCount,
                publishedAt: firstNews.publishedAt,
                readingTime: firstNews.readTime,
            },
            beritaLainnya: otherNews.map((news) => ({
                id: news.id,
                slug: news.slug,
                judul: news.title,
                publishedAt: news.publishedAt,
                kategori: news.category,
                ringkasan: news.excerpt,
                gambar: news.featuredImage,
            })),
        };
    };

    const newsData = transformNewsData(externalNews);
    const showNewsFallback = !newsData || !newsData.beritaUtama;

    return (
        <div className="beranda-container bg-background">
            {/* Hero Section with Layanan Cepat */}
            <section 
                className="hero-area py-16 relative bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: "url('/images/klikdesa-banner.jpg')" }}
            >
                {/* Overlay gradient for contrast and readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-950/80 to-emerald-950/80 z-10" />
                {/* <WeatherAnimation weatherData={weatherData} className="z-10 opacity-60" /> */}
                <div className="container mx-auto px-4 relative z-20">
                    {/* Hero Text */}
                    <div className="text-center text-foreground mb-12 flex flex-col items-center justify-center">
                        <img src="/images/logo.png" alt="Portal Klikdesa Logo" className="h-16 w-auto mb-5 drop-shadow-md hover:scale-105 transition-transform duration-300" />
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-sm text-white tracking-tight">Portal Klikdesa</h1>
                        <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow-sm font-medium max-w-4xl mx-auto">
                            Katalog Layanan Interaktif & Kolaborasi Desa - Dispermades PPKB Kabupaten Banjarnegara
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Badge
                                variant="default"
                                className="bg-white/95 text-cyan-900 border-cyan-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 backdrop-blur-sm px-4 py-1.5 text-sm"
                            >
                                <Eye className="text-cyan-600 mr-1.5 h-4 w-4" /> Transparan
                            </Badge>
                            <Badge
                                variant="default"
                                className="bg-white/95 text-cyan-900 border-cyan-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 backdrop-blur-sm px-4 py-1.5 text-sm"
                            >
                                <NotebookPen className="text-cyan-600 mr-1.5 h-4 w-4" /> Akuntabel
                            </Badge>
                            <Badge
                                variant="default"
                                className="bg-white/95 text-cyan-900 border-cyan-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 backdrop-blur-sm px-4 py-1.5 text-sm"
                            >
                                <BriefcaseBusiness className="text-cyan-600 mr-1.5 h-4 w-4" /> Profesional
                            </Badge>
                            <Badge
                                variant="default"
                                className="bg-white/95 text-cyan-900 border-cyan-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 backdrop-blur-sm px-4 py-1.5 text-sm"
                            >
                                <Lightbulb className="text-cyan-600 mr-1.5 h-4 w-4" /> Inovatif
                            </Badge>
                        </div>
                    </div>

                    {/* Layanan Cepat / Klikdesa 5 Modul Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                href: "/klikdesa/kesehatan",
                                title: "Kesehatan",
                                subtitle: "Posyandu & KB",
                                desc: "Stunting & KB tracker",
                                icon: Heart,
                                color: "bg-rose-50 border-rose-100 hover:border-rose-300 text-rose-700",
                                iconBg: "bg-rose-100 text-rose-600",
                            },
                            {
                                href: "/klikdesa/kemiskinan",
                                title: "Kemiskinan",
                                subtitle: "Pemetaan Desil",
                                desc: "Data desil 1-10 warga",
                                icon: ChartNoAxesColumnDecreasing,
                                color: "bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-800",
                                iconBg: "bg-amber-100 text-amber-600",
                            },
                            {
                                href: "/klikdesa/pemberdayaan",
                                title: "Pemberdayaan",
                                subtitle: "Sidara & TTG",
                                desc: "Katalog UMKM & TTG",
                                icon: Users,
                                color: "bg-emerald-50 border-emerald-100 hover:border-emerald-300 text-emerald-800",
                                iconBg: "bg-emerald-100 text-emerald-600",
                            },
                            {
                                href: "/klikdesa/tata-kelola",
                                title: "Tata Kelola",
                                subtitle: "Layanan & Pengaduan",
                                desc: "Surat online & aduan",
                                icon: FileText,
                                color: "bg-blue-50 border-blue-100 hover:border-blue-300 text-blue-800",
                                iconBg: "bg-blue-100 text-blue-600",
                            },
                            {
                                href: "/klikdesa/bencana",
                                title: "Kebencanaan",
                                subtitle: "CCTV, Peta & EWS",
                                desc: "Deteksi dini longsor",
                                icon: AlertTriangle,
                                color: "bg-cyan-50 border-cyan-100 hover:border-cyan-300 text-cyan-850",
                                iconBg: "bg-cyan-100 text-cyan-600",
                            },
                        ].map((link) => {
                            const IconComponent = link.icon;
                            return (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    className={`group flex flex-col p-5 rounded-2xl border bg-white/95 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-103 backdrop-blur-sm ${link.color}`}
                                >
                                    <div className={`p-3 rounded-xl w-fit mb-4 ${link.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight mb-1 text-slate-800">
                                        {link.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-slate-500 mb-2">
                                        {link.subtitle}
                                    </p>
                                    <p className="text-xs text-slate-600 leading-normal line-clamp-2 mt-auto">
                                        {link.desc}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Layanan Mandiri CTA Button */}
                    <div className="mt-16 flex justify-center">
                        <Link
                            href="/klikdesa/tata-kelola"
                            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl shadow-xl hover:shadow-primary-300/50 transition-all duration-500 hover:scale-105 overflow-hidden border border-primary-500"
                        >
                            {/* Animated background shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                            {/* Custom SVG Icon */}
                            <div className="relative z-10 flex-shrink-0">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="drop-shadow-lg group-hover:rotate-12 transition-transform duration-500"
                                >
                                    {/* Document base */}
                                    <rect x="10" y="6" width="28" height="36" rx="3" fill="white" fillOpacity="0.95" />
                                    <rect x="10" y="6" width="28" height="36" rx="3" stroke="#e2e8f0" strokeWidth="2" />

                                    {/* Folded corner */}
                                    <path d="M30 6 L38 14 L30 14 Z" fill="#f1f5f9" />
                                    <path
                                        d="M30 6 L38 14 L30 14 Z"
                                        stroke="#cbd5e1"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    />

                                    {/* Document lines */}
                                    <line
                                        x1="15"
                                        y1="20"
                                        x2="28"
                                        y2="20"
                                        stroke="#10b981"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <line
                                        x1="15"
                                        y1="25"
                                        x2="33"
                                        y2="25"
                                        stroke="#14b8a6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <line
                                        x1="15"
                                        y1="30"
                                        x2="30"
                                        y2="30"
                                        stroke="#06b6d4"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />

                                    {/* Checkmark circle */}
                                    <circle
                                        cx="25"
                                        cy="35"
                                        r="7"
                                        fill="#10b981"
                                        className="group-hover:scale-110 transition-transform origin-center"
                                    />
                                    <path
                                        d="M22 35 L24 37 L28 33"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 text-left">
                                <div className="text-2xl font-bold text-white drop-shadow-md">Layanan Mandiri</div>
                                <div className="text-white/90 text-sm mt-1">Ajukan permohonan secara online →</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Dasbor Eksekutif Terintegrasi (Mini Dashboard) */}
            <section className="bg-slate-50 border-y border-slate-200 py-12 relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col xl:flex-row gap-8 items-center justify-between">
                        {/* Text and Map/Banner side */}
                        <div className="xl:w-1/3 space-y-6 text-center xl:text-left">
                            <div>
                                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 mb-3 text-xs font-bold px-3 py-1">
                                    <MapPin className="w-3 h-3 mr-1.5 inline" /> Banjarnegara Command Center
                                </Badge>
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dasbor Eksekutif Kabupaten</h2>
                                <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                                    Pusat pemantauan data sektoral terintegrasi level kabupaten. Memonitor demografi, pengentasan kemiskinan (VEDA), layanan kesehatan, dan potensi UMKM secara real-time dari 270 desa.
                                </p>
                            </div>
                            
                            <Link 
                                href="/kabupaten"
                                className="group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                Buka Dasbor Eksekutif
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Macro Stats Grid */}
                        <div className="xl:w-2/3 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: "Total Penduduk", value: "1.043", unit: "Ribu Jiwa", icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                                { title: "Indeks Stunting", value: "14.2", unit: "%", icon: Heart, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
                                { title: "RTLH Terdata", value: "4.520", unit: "Unit", icon: Building, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                                { title: "Desa Digital", value: "65", unit: "%", icon: Server, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" }
                            ].map((stat, idx) => (
                                <div key={idx} className={`p-5 rounded-2xl border ${stat.border} bg-white hover:shadow-md transition-shadow group`}>
                                    <div className={`p-2.5 rounded-lg w-fit ${stat.bg} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
                                        <span className="text-xs font-bold text-slate-400">{stat.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content - 3 Columns with Berita bigger */}
            <section className="content-area container mx-auto px-4 py-8 space-y-4">
                {/* Header */}
                <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Berita & Informasi Terbaru</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Informasi dan kegiatan terbaru seputar desa di kab banjarnegara
        </p>
      </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Kolom 1 - Pengumuman */}
                    <div className="content-left space-y-4 lg:col-span-1 flex flex-col">
                        {/* Pengumuman */}
                        <Card className="bg-card border-border">
                            <CardHeader className="gap-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Bell className="h-5 w-5 text-primary-950" />
                {t("pengumuman.pengumuman")}
              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {serverData.pengumuman.slice(0, 5).map((item) => (
                                    <Link href="#" key={item.id} className="flex items-start pb-0 last:pb-4">
                                        <div className="border-l-4 border-secondary pl-3 bg-white p-2 hover:scale-102 shadow-sm hover:shadow-md rounded-md">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge
                                                    variant={
                                                        item.prioritas === "tinggi"
                                                            ? "destructive"
                                                            : item.prioritas === "penting"
                                                              ? "secondary"
                                                              : "outline"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {t(`pengumuman.prioritas.${item.prioritas}`)}
                                                </Badge>
                                            </div>
                                            <h4 className="font-medium text-sm leading-tight">{item.judul}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {item.konten}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                <CustomButton variant="default" size="sm" className="w-full mt-3" asChild>
                                    <Link
                                        href="/pengumuman"
                                        className="flex items-center justify-center gap-2 text-white"
                                    >
                                        {t("pengumuman.lihatSemuaPengumuman")}
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </CustomButton>
                            </CardContent>
                        </Card>

                        {/* Tata Kelola Pemerintahan (OpenSID Integration) */}
                        <Card className="bg-card border-border">
                            <CardHeader className="gap-0 pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg text-blue-700 font-bold">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    Tata Kelola Pemerintahan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                                    <div className="flex justify-between items-center text-xs text-blue-800 font-bold">
                                        <span>Website Desa (OpenSID)</span>
                                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 scale-90 border-none font-bold text-[9px]">175 Online</Badge>
                                    </div>
                                    <div className="text-2xl font-extrabold text-blue-900">270 Desa</div>
                                    <p className="text-[10px] text-slate-500">Jumlah desa di Kabupaten Banjarnegara yang terdeteksi di dasbor OpenSID</p>
                                </div>

                                <div className="space-y-1.5 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                                    <div className="flex justify-between items-center text-xs text-purple-800 font-bold">
                                        <span>Sinkronisasi OpenData</span>
                                        <span className="text-[10px] text-purple-650 font-bold">Kominfo</span>
                                    </div>
                                    <div className="text-2xl font-extrabold text-purple-900">150 Desa</div>
                                    <p className="text-[10px] text-slate-500">Desa dengan database kependudukan tersinkronisasi portal OpenData Kominfo</p>
                                </div>

                                <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                                    <div className="flex justify-between items-center text-xs text-amber-800 font-bold">
                                        <span>Persentase Smart Village</span>
                                        <span className="text-[10px] text-amber-600 font-bold">★ Cukup Baik</span>
                                    </div>
                                    <div className="text-2xl font-extrabold text-amber-900">65% Terhubung</div>
                                    <p className="text-[10px] text-slate-500">Rata-rata integrasi layanan surat-menyurat dan portal informasi desa</p>
                                </div>

                                <CustomButton variant="default" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 mt-2 text-white border-none" asChild>
                                    <Link href="/klikdesa/tata-kelola" className="flex items-center justify-center gap-2">
                                        Pantau OpenSID & Layanan
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </CustomButton>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom 2 - Berita */}
                    <div className="content-center space-y-4 lg:col-span-2 flex flex-col">
                        {newsLoading && (
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                        <Newspaper className="h-5 w-5 text-primary" />
                                        Berita Desa
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                                </CardContent>
                            </Card>
                        )}
                        {!newsLoading && showNewsFallback && (
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                        <Newspaper className="h-5 w-5 text-primary" />
                                        Berita Desa
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        {newsError ? "Gagal memuat berita. Silakan coba lagi." : "Berita belum tersedia."}
                                    </p>
                                    <div className="flex gap-2">
                                        <CustomButton variant="outline" size="sm" className="flex-1" onClick={() => window.location.reload()}>
                                            Muat Ulang
                                        </CustomButton>
                                        <CustomButton variant="default" size="sm" className="flex-1" asChild>
                                            <Link
                                                href="/berita"
                                                className="flex items-center justify-center gap-2 text-white"
                                            >
                                                Lihat Semua Berita
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </CustomButton>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        {/* Berita Terbaru - Only show if we have news data */}
                        {newsData && newsData.beritaUtama && (
                            <Card className="overflow-hidden py-0 gap-0 pt-0">
                                <div className="aspect-video relative bg-muted">
                                    <ImageFallback
                                        src={newsData.beritaUtama.gambar}
                                        alt={newsData.beritaUtama.judul}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                                        className="object-cover w-full h-full"
                                        priority
                                    />
                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge variant="secondary" className="bg-secondary/90 backdrop-blur-sm text-xs">
                                            {newsData.beritaUtama.kategori}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h2 className="text-1xl md:text-2xl font-bold mb-3 line-clamp-2 text-foreground">
                                        {newsData.beritaUtama.judul}
                                    </h2>
                                    <p className="text-muted-foreground mb-4 line-clamp-3 text-justify">
                                        {newsData.beritaUtama.ringkasan}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(newsData.beritaUtama.publishedAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Timer className="h-4 w-4" />
                                                <span>
                                                    {newsData.beritaUtama.readingTime} {t("berita.waktuBaca")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{newsData.beritaUtama.views}</span>
                                            </div>
                                        </div>
                                        {/* Desktop */}
                                        <Link
                                            href={`/berita/${newsData.beritaUtama.slug}`}
                                            prefetch={false}
                                            className="hidden md:inline-flex w-full sm:w-auto items-center justify-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                                        >
                                            {t("berita.bacaSelengkapnya")}
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                        {/* Mobile */}
                                        <CustomButton
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-3 hover:text-foreground block md:hidden"
                                            asChild
                                        >
                                            <Link
                                                href={`/berita/${newsData.beritaUtama.slug}`}
                                                prefetch={false}
                                                className="flex items-center justify-center gap-2"
                                            >
                                                {t("berita.bacaSelengkapnya")}
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </CustomButton>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Berita Lainnya - Only show if we have other news */}
                        {newsData && newsData.beritaLainnya && newsData.beritaLainnya.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                        <Newspaper className="h-5 w-5 text-primary" />
                                        Berita Terbaru
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {newsData.beritaLainnya.map((berita) => (
                                            <div
                                                key={berita.id}
                                                className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0"
                                            >
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm leading-tight mb-1">
                                                        <Link
                                                            href={`/berita/${"slug" in berita ? berita.slug : ""}`}
                                                            prefetch={false}
                                                            className="hover:text-primary transition-colors"
                                                        >
                                                            {berita.judul}
                                                        </Link>
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatTimeAgo(berita.publishedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <CustomButton variant="default" size="sm" className="w-full mt-3" asChild>
                                        <Link
                                            href="/berita"
                                            className="flex items-center justify-center gap-2 text-white"
                                        >
                                            {t("berita.lihatSemuaBerita")}
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </CustomButton>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Kolom 3 - Kegiatan, Cuaca, Aplikasi */}
                    <div className="content-right space-y-4 lg:col-span-1 flex flex-col">
                        {/* Kegiatan Hari Ini */}
                        <Card>
                            <CardHeader className="gap-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Agenda Kegiatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {serverData.events.map((event) => (
                                        <Link key={event.id} href="#">
                                            <div className="flex items-start space-x-3 pb-4 border-b last:border-0">
                                                <EventDate event={event} />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm leading-tight mb-1 hover:text-primary">
                                                        {event.nama}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{event.waktu}</span>
                                                        <MapPin className="h-3 w-3 ml-1" />
                                                        <span>{event.lokasi}</span>
                                                    </div>
                                                    <Badge variant="outline" className="mt-1 text-xs">
                                                        {event.kategori}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <CustomButton variant="default" size="sm" className="w-full mt-3" asChild>
                                    <Link
                                        href="/kegiatan"
                                        className="flex items-center justify-center gap-2 text-white"
                                    >
                                        {t("kegiatan.jadwalLengkap")}
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </CustomButton>
                            </CardContent>
                        </Card>

                        {/* Cuaca */}
                        <Card className="py-0">
                            <WeatherCard />
                        </Card>
                    </div>
                </div>
            </section>

            <DecorativeSeparator />

            {/* Statistik Layanan Digital (Clasnet) */}
            <section className="container mx-auto px-4 py-8">
                <ClasnetStatistik />
            </section>

            {/* Tata Kelola Pemerintahan Desa (OpenSID) */}
            <section className="idm-area container mx-auto px-4 py-8">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                        Integrasi Tata Kelola Pemerintahan Desa (OpenSID)
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                        Status konektivitas website desa, sinkronisasi database kependudukan, dan persentase Smart Village se-Kabupaten Banjarnegara
                    </p>
                </div>
                <OpenSIDStatsDisplay />
            </section>
        </div>
    );
}

function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
        return "Baru saja";
    } else if (diffInHours < 24) {
        return `${diffInHours} jam lalu`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} hari lalu`;
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    };
    return date.toLocaleDateString("id-ID", options);
}

