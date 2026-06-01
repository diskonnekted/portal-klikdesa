"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Heart, Activity, Baby, ShieldCheck, ChevronLeft, Calendar, Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// List of Kecamatan and their corresponding Desa
import { regionData } from "@/lib/regionsData";

// Generates mock data seeded by the village name to keep it consistent
function getMockDataForVillage(village: string) {
    const seed = village.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const stunting2023 = 20 + (seed % 15);
    const stunting2024 = Math.max(12, stunting2023 - 5 - (seed % 4));
    const stunting2025 = Math.max(8, stunting2024 - 4 - (seed % 3));

    const activeKader = 30 + (seed % 50);
    const kbParticipants = 300 + (seed % 700);

    const stuntingTrend = [
        { name: "2023", Rate: stunting2023, Target: 18 },
        { name: "2024", Rate: stunting2024, Target: 16 },
        { name: "2025", Rate: stunting2025, Target: 14 },
    ];

    const kbDistribution = [
        { name: "Suntik", value: Math.floor(kbParticipants * 0.4), color: "#f43f5e" },
        { name: "Pil", value: Math.floor(kbParticipants * 0.3), color: "#fb7185" },
        { name: "IUD/Spiral", value: Math.floor(kbParticipants * 0.15), color: "#fda4af" },
        { name: "Implan", value: Math.floor(kbParticipants * 0.1), color: "#fecdd3" },
        { name: "Kondom", value: Math.floor(kbParticipants * 0.05), color: "#ffe4e6" },
    ];

    return {
        stuntingRate: stunting2025,
        stuntingReduction: stunting2023 - stunting2025,
        activeKader,
        kbParticipants,
        stuntingTrend,
        kbDistribution
    };
}

export default function KesehatanPage() {
    const kecamatans = Object.keys(regionData);
    
    // Dropdown states
    const [selectedKec, setSelectedKec] = useState("Kecamatan Banjarmangu");
    const [selectedDesa, setSelectedDesa] = useState("Desa Sijenggung");

    // Handle Kecamatan change and reset selected Desa
    const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const kec = e.target.value;
        setSelectedKec(kec);
        setSelectedDesa(regionData[kec][0]);
    };

    // Calculate dynamic data based on selected village
    const data = useMemo(() => getMockDataForVillage(selectedDesa), [selectedDesa]);

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kesehatan Terpadu</h1>
                        <p className="text-slate-500 mt-1">Dasbor Pemantauan Posyandu, KB, dan Penurunan Stunting Kabupaten Banjarnegara</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link 
                            href="https://posyandu-sijenggung.smartdesa.net/" 
                            target="_blank"
                            className="flex items-center gap-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition p-3 rounded-2xl text-rose-850 text-sm font-semibold"
                        >
                            <Heart className="h-5 w-5 text-rose-600" />
                            Posyandu Sijenggung
                        </Link>
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-800 text-sm font-semibold">
                            <Activity className="h-5 w-5 text-rose-600 animate-pulse" />
                            Portal Terintegrasi
                        </div>
                    </div>
                </div>

                {/* Filters Dropdown */}
                <Card className="border-rose-150 bg-white shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-slate-800">Filter Lokasi Wilayah</CardTitle>
                        <CardDescription>Pilih Kecamatan dan Desa untuk menampilkan analisis data kesehatan spesifik</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 mb-1">KECAMATAN</label>
                            <select
                                value={selectedKec}
                                onChange={handleKecChange}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                            >
                                {kecamatans.map((kec) => (
                                    <option key={kec} value={kec}>{kec}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 mb-1">DESA</label>
                            <select
                                value={selectedDesa}
                                onChange={(e) => setSelectedDesa(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                            >
                                {regionData[selectedKec].map((desa) => (
                                    <option key={desa} value={desa}>{desa}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-rose-100 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Angka Stunting ({selectedDesa})</span>
                                <Baby className="h-5 w-5 text-rose-500" />
                            </div>
                            <div className="text-3xl font-bold text-rose-700">{data.stuntingRate}%</div>
                            <p className="text-xs text-emerald-600 mt-1 font-semibold">↓ Turun {data.stuntingReduction}% sejak 2023</p>
                        </CardContent>
                    </Card>

                    <Card className="border-rose-100 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Kader Posyandu Aktif</span>
                                <Heart className="h-5 w-5 text-rose-500" />
                            </div>
                            <div className="text-3xl font-bold text-rose-700">{data.activeKader} Kader</div>
                            <p className="text-xs text-slate-500 mt-1">Mengelola layanan Posyandu balita & lansia</p>
                        </CardContent>
                    </Card>

                    <Card className="border-rose-100 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Peserta Aktif KB</span>
                                <ShieldCheck className="h-5 w-5 text-rose-500" />
                            </div>
                            <div className="text-3xl font-bold text-rose-700">{data.kbParticipants} Warga</div>
                            <p className="text-xs text-emerald-600 mt-1 font-semibold">Tingkat partisipasi tinggi</p>
                        </CardContent>
                    </Card>

                    <Card className="border-rose-100 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Status Capaian</span>
                                <Activity className="h-5 w-5 text-rose-500" />
                            </div>
                            <div className="text-lg font-bold text-rose-700">Terintegrasi Dispermades</div>
                            <p className="text-xs text-slate-500 mt-1">Data terverifikasi PKKB</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Visualizations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Stunting Chart */}
                    <Card className="border-rose-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Tren Penurunan Stunting (%) - {selectedDesa}</CardTitle>
                            <CardDescription>Berdasarkan pengukuran periodik tinggi/berat badan anak balita</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.stuntingTrend}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Rate" fill="#f43f5e" name="Tingkat Riil Stunting" />
                                    <Bar dataKey="Target" fill="#cbd5e1" name="Target Nasional" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* KB Chart */}
                    <Card className="border-rose-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Metode Kontrasepsi Aktif - {selectedDesa}</CardTitle>
                            <CardDescription>Persentase penggunaan alat kontrasepsi keluarga berencana</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <ResponsiveContainer width="60%" height="100%">
                                <PieChart>
                                    <Pie data={data.kbDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {data.kbDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-col gap-2 w-40">
                                {data.kbDistribution.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                                        <span className="text-slate-600 font-semibold">{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Evacuation and Schedules specific to selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 border-rose-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Program Penurunan Stunting Unggulan di {selectedDesa}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "DASHAT (Dapur Sehat Atasi Stunting)", target: "Keluarga Berisiko Stunting", status: "Aktif" },
                                { title: "PMT (Pemberian Makanan Tambahan) Pemulihan", target: "Balita dengan berat badan kurang", status: "Berjalan" },
                                { title: "Kunjungan Rumah Terintegrasi Kader", target: "Ibu Hamil Kategori Risti", status: "Aktif" },
                            ].map((prog) => (
                                <div key={prog.title} className="flex items-center justify-between p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800">{prog.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Sasaran di {selectedDesa}: {prog.target}</p>
                                    </div>
                                    <Badge className="bg-rose-600 text-white">{prog.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-rose-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Jadwal Posyandu & KB Keliling ({selectedDesa})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { date: "15 Juni 2026", loc: `Balai Desa ${selectedDesa.split(" ").slice(1).join(" ")}`, type: "Vitamin A & Imunisasi Balita" },
                                { date: "24 Juni 2026", loc: "Polindes Kesehatan Desa", type: "Pelayanan Kontrasepsi KB Gratis" },
                            ].map((sched) => (
                                <div key={sched.date} className="flex gap-3">
                                    <div className="bg-rose-100 text-rose-700 p-2.5 rounded-xl h-fit">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-rose-600 font-bold block">{sched.date}</span>
                                        <h5 className="font-bold text-sm text-slate-800 mt-0.5 leading-tight">{sched.loc}</h5>
                                        <p className="text-xs text-slate-500 mt-0.5">{sched.type}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
