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
    GraduationCap,
    ChartNoAxesColumnDecreasing,
    Vote,
    Clock,
    Newspaper,
    Eye,
    NotebookPen,
    BriefcaseBusiness,
    Lightbulb,
    AlertTriangle,
    Users,
    CreditCard,
} from "lucide-react";

import ImageFallback from "@/components/ui/custom/ImageFallback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomButton } from "@/components/ui/custom/CustomButton";
import { SDGsDashboard } from "@/components/ui/custom/SDGsDashboard";
import { StatisticsDisplay } from "@/components/ui/custom/StatisticsDisplay";
import { WeatherCard } from "@/components/ui/custom/WeatherCard";
import { IDMDisplay } from "@/components/ui/custom/IDMDisplay";
import { KeuanganSummary } from "@/components/ui/custom/KeuanganSummary";
import { YearSelector } from "@/components/ui/custom/YearSelector";
import { DecorativeSeparator } from "@/components/ui/custom/DecorativeSeparator";
import { useExternalNews } from "@/hooks/useExternalNews";
import { useHolidays } from "@/hooks/useHolidays";
import { useTranslation } from "@/lib/useTranslation";
import { EventDate } from "@/components/EventDate";
import { HolidayCards } from "@/components/ui/custom/HolidayCards";

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
    Vote,
    Phone,
    Download,
};

export function HomePageClient({ serverData }: { serverData: ServerData }) {
    const { t } = useTranslation();
    const { news: externalNews, loading: newsLoading, error: newsError } = useExternalNews(20);
    const { holidays, loading: holidaysLoading, error: holidaysError } = useHolidays(10);
    const [selectedYear, setSelectedYear] = React.useState<number>(2024);

    // Calculate available years (2021 to current year)
    // Using fixed current year to avoid Next.js prerender issues
    // TODO: Update this value annually (e.g., change 2025 to 2026 in 2026)
    const currentYear = 2025;
    const availableYears = React.useMemo(() => {
        const years = [];
        for (let year = 2021; year <= currentYear; year++) {
            years.push(year);
        }
        return years;
    }, [currentYear]);

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
            Vote: "sdgs.svg",
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
            <section className="hero-area bg-[#26C6DA] py-16 relative">
                {/* <WeatherAnimation weatherData={weatherData} className="z-10 opacity-60" /> */}
                <div className="container mx-auto px-4 relative z-20">
                    {/* Hero Text */}
                    <div className="text-center text-foreground mb-12">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-sm text-white tracking-tight">Klikdesa</h1>
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
                        <a
                            href="https://sijenggung-banjarnegara.desa.id/layanan-mandiri"
                            target="_blank"
                            rel="noopener noreferrer"
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
                                <div className="text-white/90 text-sm mt-1">Ajukan permohonan secara online â†’</div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Main Content - 3 Columns with Berita bigger */}
            <section className="content-area container mx-auto px-4 py-8 space-y-4">
                {/* Header */}
                <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Berita & Informasi Terbaru</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ada kegiatan apa saja di Desa Sijenggung hari ini?
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

                        {/* Laporan Keuangan - Current Year Only */}
                        <Card className="bg-card border-border">
                            <CardHeader className="gap-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-secondary">
                                    <DollarSign className="h-5 w-5 text-secondary" />
                                    Laporan Keuangan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <KeuanganSummary />
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
                                            <a
                                                href="https://sijenggung-banjarnegara.desa.id/artikel/kategori/berita-desa"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 text-white"
                                            >
                                                Lihat di OpenSID
                                                <ChevronRight className="h-4 w-4" />
                                            </a>
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

            {/* Hari Libur Cards Section */}
            <section className="holidays-area container mx-auto px-4 py-8">
                <HolidayCards holidays={holidays} loading={holidaysLoading} error={holidaysError} />
            </section>

            <DecorativeSeparator />

            {/* IDM - Indeks Desa Mandiri */}
            <section className="idm-area container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Indeks Desa Mandiri (IDM)</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Evaluasi capaian Indeks Desa Mandiri</p>
                    <div className="mt-4">
                        <YearSelector
                            years={availableYears}
                            selectedYear={selectedYear}
                            onYearChange={setSelectedYear}
                            className="max-w-4xl mx-auto mb-4"
                        />
                    </div>
                </div>
                <IDMDisplay year={selectedYear.toString()} />
            </section>

            <DecorativeSeparator />

            {/* Statistik Desa */}
            <section className="statistics-area container mx-auto px-4 py-8">
                <StatisticsDisplay />
            </section>

            <DecorativeSeparator />

            {/* Dasbor SDGs */}
            <section className="sdgs-area container mx-auto px-4 py-8 pb-20">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Tujuan Pembangunan Berkelanjutan (SDGs)</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Pantau kemajuan implementasi 18 Tujuan Pembangunan Berkelanjutan di Desa Sijenggung
                    </p>
                </div>
                <SDGsDashboard />
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

