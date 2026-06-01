"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CreditCard, TrendingDown, Users, ChevronLeft, Landmark, MapPin, Map, Home, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";

// List of Kecamatan and their corresponding Desa
import { regionData } from "@/lib/regionsData";

// Generates VEDA-themed mock data seeded by the village name
function getVedaMockData(village: string) {
    const seed = village.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Total Households (KK)
    const totalKK = 400 + (seed % 600);
    
    // Desil distribution
    const d1 = Math.floor(totalKK * (0.08 + (seed % 5) / 100)); // Sangat Miskin
    const d2 = Math.floor(totalKK * (0.12 + (seed % 6) / 100)); // Miskin
    const d3 = Math.floor(totalKK * (0.15 + (seed % 7) / 100)); // Hampir Miskin
    const d4 = Math.floor(totalKK * (0.20 + (seed % 8) / 100)); // Rentan
    
    // Rumah Tidak Layak Huni (RTLH)
    const rtlh = Math.floor((d1 + d2) * (0.6 + (seed % 3) / 10));
    
    // Social Assistance coverage
    const pkh = Math.floor(d1 * 0.9 + d2 * 0.5);
    const bpnt = Math.floor((d1 + d2) * 0.85);
    const blt = Math.floor(d1 * 0.95);

    // Housing condition statistics (VEDA features)
    const housingStats = [
        { category: "Tembok", value: Math.floor(totalKK * (0.55 + (seed % 20) / 100)), fill: "#d97706" },
        { category: "Semi-Tembok", value: Math.floor(totalKK * (0.25 + (seed % 15) / 100)), fill: "#f59e0b" },
        { category: "Bambu/Kayu", value: Math.floor(totalKK * (0.10 + (seed % 10) / 100)), fill: "#fbbf24" },
    ];

    const floorStats = [
        { category: "Keramik/Ubin", value: Math.floor(totalKK * (0.60 + (seed % 15) / 100)), fill: "#047857" },
        { category: "Semen/Plester", value: Math.floor(totalKK * (0.25 + (seed % 10) / 100)), fill: "#10b981" },
        { category: "Tanah", value: Math.floor(totalKK * (0.05 + (seed % 5) / 100)), fill: "#34d399" },
    ];

    const desilDistribution = [
        { desil: "Desil 1", KK: d1, label: "Sangat Miskin" },
        { desil: "Desil 2", KK: d2, label: "Miskin" },
        { desil: "Desil 3", KK: d3, label: "Hampir Miskin" },
        { desil: "Desil 4", KK: d4, label: "Rentan" },
    ];

    return {
        totalKK,
        d1, d2, d3, d4,
        rtlh,
        pkh,
        bpnt,
        blt,
        desilDistribution,
        housingStats,
        floorStats
    };
}

export default function KemiskinanPage() {
    const kecamatans = Object.keys(regionData);
    
    // Defaulting to Kecamatan Banjarmangu and Desa Sijenggung
    const [selectedKec, setSelectedKec] = useState("Kecamatan Banjarmangu");
    const [selectedDesa, setSelectedDesa] = useState("Desa Sijenggung");

    const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const kec = e.target.value;
        setSelectedKec(kec);
        setSelectedDesa(regionData[kec][0]);
    };

    // Calculate VEDA stats dynamically
    const veda = useMemo(() => getVedaMockData(selectedDesa), [selectedDesa]);

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Beranda
                </Link>

                {/* Page Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pengentasan Kemiskinan (VEDA)</h1>
                        <p className="text-slate-500 mt-1">Visual Economic Data Analytics (VEDA) — Pemetaan Kesejahteraan & Kondisi Rumah Kabupaten Banjarnegara</p>
                    </div>
                    <a
                        href="https://geospasial.clasnet.my.id/login"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-amber-50 border border-amber-200 hover:border-amber-400 p-3 rounded-2xl text-amber-800 hover:text-amber-900 text-sm font-semibold hover:shadow-md transition-all cursor-pointer"
                    >
                        <Map className="h-5 w-5 text-amber-600" />
                        VEDA Geospatial Engine Active
                    </a>
                </div>

                {/* Filters Dropdown */}
                <Card className="border-amber-150 bg-white shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-slate-800">Filter Wilayah Analitik</CardTitle>
                        <CardDescription>Pilih wilayah kerja untuk memetakan data kemiskinan dan kelayakan hunian</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 mb-1">KECAMATAN</label>
                            <select
                                value={selectedKec}
                                onChange={handleKecChange}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm text-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            >
                                {regionData[selectedKec].map((desa) => (
                                    <option key={desa} value={desa}>{desa}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* VEDA Economic Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-amber-100 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Total KK Terdata</span>
                                <Users className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="text-3xl font-bold text-amber-700">{veda.totalKK} KK</div>
                            <p className="text-xs text-slate-500 mt-1">Sensus Ekonomi Terintegrasi</p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-100 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Sangat Miskin (Desil 1)</span>
                                <Landmark className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="text-3xl font-bold text-amber-700">{veda.d1} KK</div>
                            <p className="text-xs text-emerald-600 mt-1 font-semibold">Priority 1 Social Assistance</p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-100 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Rumah Tidak Layak (RTLH)</span>
                                <Home className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="text-3xl font-bold text-amber-700">{veda.rtlh} Unit</div>
                            <p className="text-xs text-amber-600 mt-1 font-semibold">Target bedah rumah desil 1-2</p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-100 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Ketepatan Penyaluran</span>
                                <TrendingDown className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="text-xl font-bold text-amber-700">95.4% Akurat</div>
                            <p className="text-xs text-emerald-600 mt-1 font-semibold">Berdasarkan VEDA Crosscheck</p>
                        </CardContent>
                    </Card>
                </div>

                {/* VEDA Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Desil Bar Chart */}
                    <Card className="border-amber-100 bg-white md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Distribusi Kesejahteraan Warga (Desil 1-4) - {selectedDesa}</CardTitle>
                            <CardDescription>Visualisasi jumlah Kepala Keluarga (KK) per kelompok kemiskinan</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={veda.desilDistribution}>
                                    <XAxis dataKey="desil" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="KK" fill="#d97706" name="Jumlah Keluarga (KK)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* VEDA Housing Quality Pie Chart */}
                    <Card className="border-amber-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Kelayakan Bahan Dinding</CardTitle>
                            <CardDescription>Analisis materi dinding hunian terdata</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80 flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height="70%">
                                <PieChart>
                                    <Pie data={veda.housingStats} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={60} label>
                                        {veda.housingStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-col gap-1 w-full px-2 mt-2">
                                {veda.housingStats.map((entry) => (
                                    <div key={entry.category} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.fill }}></span>
                                            <span className="text-slate-600">{entry.category}</span>
                                        </div>
                                        <span className="font-bold text-slate-800">{entry.value} KK</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Evacuation Shelters & Evac Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-amber-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Analisis Jenis Lantai Rumah</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {veda.floorStats.map((stat) => (
                                <div key={stat.category} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                                        <span>Lantai: {stat.category}</span>
                                        <span>{stat.value} Rumah</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full" 
                                            style={{ 
                                                width: `${(stat.value / veda.totalKK) * 100}%`,
                                                backgroundColor: stat.fill 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 border-amber-100 bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Integrasi Pengendalian Bansos VEDA di {selectedDesa}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: "PKH (Program Keluarga Harapan)", penerima: `${veda.pkh} KK`, target: "Desil 1 & 2 Prioritas Balita/Sekolah" },
                                { name: "BPNT (Bantuan Pangan Non Tunai)", penerima: `${veda.bpnt} KK`, target: "Desil 1, 2, 3 Sembako Terjadwal" },
                                { name: "BLT Dana Desa (Bantuan Langsung Tunai)", penerima: `${veda.blt} KK`, target: "Desil 1 Miskin Ekstrem Terlindungi" }
                            ].map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Sasaran: {item.target}</p>
                                    </div>
                                    <Badge className="bg-amber-600 text-white font-bold">{item.penerima}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
