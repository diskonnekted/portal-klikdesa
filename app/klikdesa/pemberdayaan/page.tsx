"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users, Lightbulb, ShoppingBag, ChevronLeft, Search, Wrench, Landmark, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// List of Kecamatan and their corresponding Desa
import { regionData } from "@/lib/regionsData";

// Scraped TTG cards data from https://ttg.pondokrejo.id/
const ttgCards = [
    {
        id: 82,
        title: "Kelola Sampah",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=82",
        img: "https://ttg.pondokrejo.id/uploads/kelola_sampah.jpg",
        date: "2 bulan lalu",
        category: "Kesehatan & Lingkungan"
    },
    {
        id: 83,
        title: "Minyak Atsiri Fuli Buah Pala",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=83",
        img: "https://ttg.pondokrejo.id/uploads/minyak_atsiri.jpg",
        date: "2 bulan lalu",
        category: "Pertanian & Industri"
    },
    {
        id: 84,
        title: "Mujair",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=84",
        img: "https://ttg.pondokrejo.id/uploads/mujair.jpg",
        date: "2 bulan lalu",
        category: "Perikanan"
    },
    {
        id: 85,
        title: "Budidaya Patin",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=85",
        img: "https://ttg.pondokrejo.id/uploads/patinooooooooooo.jpg",
        date: "2 bulan lalu",
        category: "Perikanan"
    },
    {
        id: 86,
        title: "Pedoman Penyakit Ikan Laut",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=86",
        img: "https://ttg.pondokrejo.id/uploads/penyakit_ikan_laut_2.jpg",
        date: "2 bulan lalu",
        category: "Perikanan"
    },
    {
        id: 87,
        title: "Pektin Kakao",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=87",
        img: "https://ttg.pondokrejo.id/uploads/Pektin Kakao.jpg",
        date: "2 bulan lalu",
        category: "Pertanian & Industri"
    },
    {
        id: 88,
        title: "Pelihara Ikan Mina Padi",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=88",
        img: "https://ttg.pondokrejo.id/uploads/pelihara_ikan_mina_padi.jpg",
        date: "2 bulan lalu",
        category: "Perikanan & Pertanian"
    },
    {
        id: 89,
        title: "Pembenihan Bandeng",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=89",
        img: "https://ttg.pondokrejo.id/uploads/pembenihan_bandeng.jpg",
        date: "2 bulan lalu",
        category: "Perikanan"
    },
    {
        id: 90,
        title: "Pembenihan Ikan Tawes",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=90",
        img: "https://ttg.pondokrejo.id/uploads/pembenihan_ikan_tawes.jpg",
        date: "2 bulan lalu",
        category: "Perikanan"
    },
    {
        id: 91,
        title: "Pembenihan Kakap Putih",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=91",
        img: "https://ttg.pondokrejo.id/uploads/kakap.jpg",
        date: "2 bulan lalu",
        category: "Perikanan"
    },
    {
        id: 92,
        title: "Pembenihan Kakap Putih Hsrt",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=92",
        img: "https://ttg.pondokrejo.id/uploads/file_69d7bd04110de.jpg",
        date: "2 bulan lalu",
        category: "Perikanan"
    },
    {
        id: 93,
        title: "Pembenihan Kerapu Macan Bagian 1",
        href: "https://ttg.pondokrejo.id/tutorial.php?id=93",
        img: "https://ttg.pondokrejo.id/uploads/pembenihan_kerapu_macan01000000.jpg",
        date: "2 bulan lalu",
        category: "Perikanan"
    }
];

// Generates Sidara-themed mock potential data seeded by the village name
function getSidaraMockData(village: string) {
    const seed = village.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Land use area in Hectares (Ha)
    const sawah = 100 + (seed % 150);
    const kebun = 80 + (seed % 100);
    const hutan = 50 + (seed % 80);
    const pemukiman = 40 + (seed % 60);
    const totalArea = sawah + kebun + hutan + pemukiman;

    const landUseData = [
        { name: "Sawah", Luas: sawah, fill: "#057857" },
        { name: "Perkebunan", Luas: kebun, fill: "#10b981" },
        { name: "Hutan Desa", Luas: hutan, fill: "#34d399" },
        { name: "Pemukiman", Luas: pemukiman, fill: "#a7f3d0" },
    ];

    // Livestock populations
    const sapi = 40 + (seed % 60);
    const kambing = 120 + (seed % 200);
    const domba = 80 + (seed % 150);
    const ayam = 1000 + (seed % 5000);

    const livestockData = [
        { name: "Sapi", Jumlah: sapi },
        { name: "Kambing", Jumlah: kambing },
        { name: "Domba", Jumlah: domba },
        { name: "Ayam Ternak", Jumlah: Math.floor(ayam / 10) }, // Scaled down for bar chart comparison
    ];

    // UMKM counts
    const umkmCount = 20 + (seed % 40);

    return {
        totalArea,
        umkmCount,
        landUseData,
        livestockData,
        livestockCounts: { sapi, kambing, domba, ayam }
    };
}

function PemberdayaanContent() {
    const kecamatans = Object.keys(regionData);
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState(tabParam === "ttg" ? "ttg" : "sidara");
    const [selectedKec, setSelectedKec] = useState("Kecamatan Banjarmangu");
    const [selectedDesa, setSelectedDesa] = useState("Desa Sijenggung");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("Semua");

    // Sync tab with URL parameters
    useEffect(() => {
        if (tabParam === "ttg" || tabParam === "sidara") {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const kec = e.target.value;
        setSelectedKec(kec);
        setSelectedDesa(regionData[kec][0]);
    };

    const handleTabChange = (tab: "sidara" | "ttg") => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set("tab", tab);
        window.history.pushState({}, "", url.pathname + url.search);
    };

    // Calculate Sidara stats dynamically
    const sidara = useMemo(() => getSidaraMockData(selectedDesa), [selectedDesa]);

    // Mock products synchronized with https://sidara.smartvillage.center/
    const umkmProducts = useMemo(() => {
        return [
            { id: 1, name: "Kopi Robusta Banjarnegara", category: "Kuliner", price: "Rp 35.000/pcs", rating: "4.8" },
            { id: 2, name: "Batik Tulis Gumelem", category: "Kriya", price: "Rp 180.000/pcs", rating: "4.9" },
            { id: 3, name: "Keripik Tempe Sagu", category: "Kuliner", price: "Rp 15.000/pcs", rating: "4.7" },
            { id: 4, name: "Minyak Kelapa Murni (VCO)", category: "Pertanian", price: "Rp 50.000/botol", rating: "4.8" },
            { id: 5, name: "Gula Aren Cair", category: "Kuliner", price: "Rp 25.000/pcs", rating: "4.6" },
            { id: 6, name: "Pupuk Organik Kompos", category: "Pertanian", price: "Rp 15.000/karung", rating: "4.5" },
            { id: 7, name: "Susu Kambing Etawa", category: "Peternakan", price: "Rp 40.000/botol", rating: "4.9" },
            { id: 8, name: "Madu Klanceng", category: "Peternakan", price: "Rp 95.000/botol", rating: "4.9" },
        ];
    }, []);

    const filteredUmkm = umkmProducts.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "Semua" || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Beranda
                </Link>

                {/* Page Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pemberdayaan Masyarakat</h1>
                        <p className="text-slate-500 mt-1">Database Potensi Desa (Sidara) & Inovasi Teknologi Tepat Guna (TTG) Kabupaten Banjarnegara</p>
                    </div>
                    {activeTab === "sidara" ? (
                        <a
                            href="https://sidara.smartvillage.center/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 hover:border-emerald-400 p-3 rounded-2xl text-emerald-800 hover:text-emerald-900 text-sm font-semibold hover:shadow-md transition-all cursor-pointer"
                        >
                            <ShoppingBag className="h-5 w-5 text-emerald-600" />
                            Sidara Database Engine Active
                        </a>
                    ) : (
                        <a
                            href="https://ttg.pondokrejo.id/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 hover:border-emerald-400 p-3 rounded-2xl text-emerald-800 hover:text-emerald-900 text-sm font-semibold hover:shadow-md transition-all cursor-pointer"
                        >
                            <Wrench className="h-5 w-5 text-emerald-600" />
                            TTG Pondokrejo Portal
                        </a>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => handleTabChange("sidara")}
                        className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${
                            activeTab === "sidara"
                                ? "border-emerald-600 text-emerald-700"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        Basis Data Potensi Desa (Sidara)
                    </button>
                    <button
                        onClick={() => handleTabChange("ttg")}
                        className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${
                            activeTab === "ttg"
                                ? "border-emerald-600 text-emerald-700"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        Katalog Teknologi Tepat Guna (TTG)
                    </button>
                </div>

                {/* Sidara Tab */}
                {activeTab === "sidara" && (
                    <>
                        {/* Filters Dropdown */}
                        <Card className="border-emerald-150 bg-white shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-slate-800">Filter Lokasi Potensi Desa</CardTitle>
                                <CardDescription>Pilih Kecamatan dan Desa untuk melihat analisis potensi ekonomi dan database komoditas</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">KECAMATAN</label>
                                    <select
                                        value={selectedKec}
                                        onChange={handleKecChange}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    >
                                        {kecamatans.map((kec) => (
                                            <option key={kec} value={kec}>{kec}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">DESA / KELURAHAN</label>
                                    <select
                                        value={selectedDesa}
                                        onChange={(e) => setSelectedDesa(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    >
                                        {regionData[selectedKec].map((desa) => (
                                            <option key={desa} value={desa}>{desa}</option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sidara Database Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="border-emerald-100 bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-500 font-semibold">Total Luas Wilayah</span>
                                        <Landmark className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-700">{sidara.totalArea} Ha</div>
                                    <p className="text-xs text-slate-500 mt-1">Sawah, Kebun & Pemukiman</p>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-100 bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-500 font-semibold">UMKM Binaan (Sidara)</span>
                                        <span className="text-emerald-500">★ Active</span>
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-700">{sidara.umkmCount} UMKM</div>
                                    <p className="text-xs text-emerald-600 mt-1 font-semibold">Terdaftar di Pasar Digital</p>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-100 bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-500 font-semibold">Populasi Sapi & Kambing</span>
                                        <Users className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-700">{sidara.livestockCounts.sapi + sidara.livestockCounts.kambing} Ekor</div>
                                    <p className="text-xs text-slate-500 mt-1">Populasi Ternak Produktif</p>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-100 bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-500 font-semibold">Kategori Potensi</span>
                                        <Lightbulb className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div className="text-lg font-bold text-emerald-700">Agro & Peternakan</div>
                                    <p className="text-xs text-emerald-600 mt-1 font-semibold">Komoditas Unggulan Terpetakan</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Potential Charts Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Land Use Chart */}
                            <Card className="border-emerald-100 bg-white">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-800">Tata Guna Lahan (Ha)</CardTitle>
                                    <CardDescription>Pembagian sebaran peruntukan lahan di {selectedDesa}</CardDescription>
                                </CardHeader>
                                <CardContent className="h-80 flex flex-col items-center justify-center">
                                    <ResponsiveContainer width="100%" height="70%">
                                        <PieChart>
                                            <Pie data={sidara.landUseData} dataKey="Luas" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                                {sidara.landUseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex flex-col gap-1 w-full px-2 mt-2">
                                        {sidara.landUseData.map((entry) => (
                                            <div key={entry.name} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.fill }}></span>
                                                    <span className="text-slate-600">{entry.name}</span>
                                                </div>
                                                <span className="font-bold text-slate-800">{entry.Luas} Ha</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Livestock Chart */}
                            <Card className="border-emerald-100 bg-white md:col-span-2">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-800">Populasi Sektor Peternakan Desa - {selectedDesa}</CardTitle>
                                    <CardDescription>Data sebaran ternak aktif terdata (Ayam Ternak diskalakan 1:10)</CardDescription>
                                </CardHeader>
                                <CardContent className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={sidara.livestockData}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Jumlah" fill="#10b981" name="Jumlah Populasi (Ekor)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidara - UMKM Section */}
                        <div className="space-y-4 pt-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <ShoppingBag className="h-6 w-6 text-emerald-600" />
                                    Database Produk UMKM Desa ({selectedDesa})
                                </h2>
                                {/* Search and Filters */}
                                <div className="flex flex-wrap gap-2 items-center">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Cari produk UMKM..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 pr-4 py-2 border-emerald-200 focus:border-emerald-500 rounded-xl bg-white w-60"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                                        {["Semua", "Kuliner", "Kriya", "Pertanian", "Peternakan"].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setFilterCategory(cat)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterCategory === cat ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {filteredUmkm.length > 0 ? (
                                    filteredUmkm.map((product) => (
                                        <Card key={product.id} className="border-emerald-100 bg-white">
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex justify-between items-center">
                                                    <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 text-[10px]">
                                                        {product.category}
                                                    </Badge>
                                                    <span className="text-xs text-amber-500 font-bold">★ {product.rating}</span>
                                                </div>
                                                <CardTitle className="text-base text-slate-800 mt-2 line-clamp-1">{product.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                                    <span className="text-sm font-bold text-emerald-700">{product.price}</span>
                                                    <button className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition-all shadow-sm">
                                                        Detail Komoditas
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-12 text-slate-400">
                                        Produk UMKM / Komoditas di {selectedDesa} tidak ditemukan.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* TTG Tab */}
                {activeTab === "ttg" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <Wrench className="h-6 w-6 text-emerald-600" />
                                Katalog Inovasi Teknologi Tepat Guna (TTG)
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Kumpulan panduan, tutorial, dan hasil inovasi teknologi terapan untuk pemberdayaan ekonomi masyarakat di Kabupaten Banjarnegara.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {ttgCards.map((card) => (
                                <Card key={card.id} className="border-emerald-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full">
                                    <div className="relative h-44 bg-slate-105 flex-shrink-0">
                                        <img src={card.img} className="w-full h-full object-cover" alt={card.title} />
                                        <Badge className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-semibold">
                                            {card.category}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-base text-slate-800 line-clamp-2 leading-snug mb-1">
                                                {card.title}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-medium">Diunggah: {card.date}</p>
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-emerald-600 font-mono">ID: TTG-{card.id}</span>
                                            <a
                                                href={card.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition hover:shadow-sm"
                                            >
                                                Baca Panduan
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PemberdayaanPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-semibold">Memuat Data Pemberdayaan...</div>}>
            <PemberdayaanContent />
        </Suspense>
    );
}
