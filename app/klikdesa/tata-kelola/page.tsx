"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FileText, MessageSquare, ChevronLeft, Globe, CheckCircle2, Search, Building2, Server, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// OpenSID detectable villages in Banjarnegara mapped by Kecamatan
import { openSidData } from "@/lib/regionsData";

export default function TataKelolaPage() {
    const kecamatans = Object.keys(openSidData);
    
    // States
    const [selectedKec, setSelectedKec] = useState("Kecamatan Banjarmangu");
    const [selectedDesa, setSelectedDesa] = useState("Semua Desa");

    // Filter villages based on selected Kecamatan and dropdown village selection
    const filteredVillages = useMemo(() => {
        const villages = openSidData[selectedKec] || [];
        if (selectedDesa === "Semua Desa") return villages;
        return villages.filter(desa => desa.name === selectedDesa);
    }, [selectedKec, selectedDesa]);

    const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedKec(e.target.value);
        setSelectedDesa("Semua Desa");
    };

    // Correct stats from https://sid.clasnet.co.id/index.php
    const stats = {
        total: 270,
        online: 175,
        syncDb: 150,
        percentage: 65
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Beranda
                </Link>

                {/* Page Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tata Kelola Pemerintahan (OpenSID)</h1>
                        <p className="text-slate-500 mt-1">Integrasi Basis Data OpenSID, Peta Geospasial, dan Status Portal Web Desa se-Kabupaten Banjarnegara</p>
                    </div>
                    <a
                        href="https://sid.clasnet.co.id/desa.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-50 border border-blue-200 hover:border-blue-400 p-3 rounded-2xl text-blue-800 hover:text-blue-900 text-sm font-semibold hover:shadow-md transition-all cursor-pointer"
                    >
                        <Globe className="h-5 w-5 text-blue-600" />
                        Dasbor OpenSID Banjarnegara
                    </a>
                </div>

                {/* OpenSID Integration Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Card 1: Total Desa OpenSID */}
                    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 border-0 gap-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                            <Building2 className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-blue-800">Total Desa OpenSID</span>
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="text-3xl font-black text-blue-900">{stats.total} Desa</div>
                            <p className="text-xs text-blue-700 mt-1">Terdeteksi & terdaftar di Kabupaten</p>
                        </CardContent>
                    </Card>

                    {/* Card 2: Website Online */}
                    <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 border-0 gap-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-emerald-600">
                            <Server className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-emerald-800">Website Online</span>
                                <Server className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="text-3xl font-black text-emerald-900">{stats.online} Desa</div>
                            <p className="text-xs text-emerald-700 mt-1">Status Web: Aktif / UP</p>
                        </CardContent>
                    </Card>

                    {/* Card 3: Sinkronisasi OpenData */}
                    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200 border-0 gap-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-purple-600">
                            <Users className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-purple-800">Sinkronisasi OpenData</span>
                                <span className="text-xs font-bold text-purple-750">Kominfo</span>
                            </div>
                            <div className="text-3xl font-black text-purple-900">{stats.syncDb} Desa</div>
                            <p className="text-xs text-purple-700 mt-1">Integrasi Portal OpenData Kominfo</p>
                        </CardContent>
                    </Card>

                    {/* Card 4: Persentase Integrasi */}
                    <Card className="relative overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 border-0 gap-0">
                        <div className="absolute -top-4 -right-4 opacity-10 text-amber-600">
                            <Globe className="h-24 w-24" />
                        </div>
                        <CardContent className="pt-6 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-amber-800">Persentase Integrasi</span>
                                <Globe className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="text-3xl font-black text-amber-900">
                                {stats.percentage}% Terhubung
                            </div>
                            <p className="text-xs text-amber-700 mt-1">Evaluasi Capaian Smart Village</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Village Directory */}
                <Card className="border-blue-100 bg-white">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg text-slate-800">Direktori OpenSID Desa</CardTitle>
                                <CardDescription>Pantau domain website, jumlah penduduk, dan sinkronisasi database OpenData Kominfo desa</CardDescription>
                            </div>
                            {/* Filter Controls */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <select
                                    value={selectedKec}
                                    onChange={handleKecChange}
                                    className="border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-xs text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
                                >
                                    {kecamatans.map((kec) => (
                                        <option key={kec} value={kec}>{kec}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedDesa}
                                    onChange={(e) => setSelectedDesa(e.target.value)}
                                    className="border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-xs text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
                                >
                                    <option value="Semua Desa">Semua Desa</option>
                                    {(openSidData[selectedKec] || []).map((desa) => (
                                        <option key={desa.name} value={desa.name}>{desa.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Desa</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Website Desa (OpenSID)</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Jumlah Penduduk</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Status Web</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Status Database</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Layanan Mandiri</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredVillages.length > 0 ? (
                                        filteredVillages.map((desa) => (
                                            <tr key={desa.name} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                                                    {desa.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a 
                                                        href={desa.web} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                    >
                                                        {desa.web}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                                                    {desa.pop} Jiwa
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={`${desa.status === "Online" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"} hover:bg-transparent border`}>
                                                        {desa.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={`${desa.db === "Tersinkron" ? "bg-blue-50 text-blue-700 border-blue-200" : desa.db === "Proses" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-700 border-slate-200"} hover:bg-transparent border`}>
                                                        {desa.db}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a 
                                                        href={`${desa.web}layanan-mandiri/masuk`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition hover:shadow-sm"
                                                    >
                                                        Masuk Layanan
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                                                Tidak ada desa terdeteksi yang cocok dengan pencarian Anda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
