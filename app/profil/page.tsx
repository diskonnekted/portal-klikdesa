"use client";

import React from "react";
import Link from "next/link";
import { 
    Heart, 
    TrendingUp, 
    Users, 
    FileText, 
    AlertTriangle, 
    Activity, 
    CheckCircle, 
    Shield, 
    Globe, 
    Info, 
    ChevronLeft,
    Lightbulb,
    Eye,
    NotebookPen,
    BriefcaseBusiness
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-8 text-slate-800">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Beranda
                </Link>

                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-xl">
                    <div className="absolute -top-12 -right-12 opacity-10 text-white pointer-events-none">
                        <Info className="h-64 w-64" />
                    </div>
                    
                    <div className="relative z-10 max-w-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="Portal Klikdesa Logo" className="h-10 w-auto object-contain" />
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase font-mono">Tentang Aplikasi</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                            Portal Klikdesa
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                            Katalog Layanan Interaktif & Kolaborasi Desa merupakan platform digital inovatif yang dikembangkan oleh Dispermades PPKB Kabupaten Banjarnegara untuk mempercepat digitalisasi desa menuju tata kelola yang transparan, akuntabel, dan efisien.
                        </p>
                        
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                                <Eye className="text-cyan-300 mr-1.5 h-3.5 w-3.5" /> Transparan
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                                <NotebookPen className="text-cyan-300 mr-1.5 h-3.5 w-3.5" /> Akuntabel
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                                <BriefcaseBusiness className="text-cyan-300 mr-1.5 h-3.5 w-3.5" /> Profesional
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 text-xs backdrop-blur-sm">
                                <Lightbulb className="text-cyan-300 mr-1.5 h-3.5 w-3.5" /> Inovatif
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Core Mission and Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg text-cyan-700 font-bold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-cyan-600" />
                                Integritas Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-650 leading-relaxed">
                                Mengintegrasikan berbagai pusat data desa (OpenSID, Sidara, dan Telemetri) ke dalam satu dashboard tunggal demi keakuratan pengambilan kebijakan pembangunan.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg text-cyan-700 font-bold flex items-center gap-2">
                                <Users className="h-5 w-5 text-cyan-600" />
                                Kolaborasi Warga
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-650 leading-relaxed">
                                Membuka akses komunikasi dua arah antara perangkat desa dengan warga melalui wadah layanan mandiri administrasi online dan posko pengaduan digital.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg text-cyan-700 font-bold flex items-center gap-2">
                                <Globe className="h-5 w-5 text-cyan-600" />
                                Digitalisasi Menyeluruh
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-650 leading-relaxed">
                                Menyediakan kerangka kerja teknologi terapan yang fleksibel dari monitoring stunting bayi hingga telemetri sensor kebencanaan secara real-time.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Features & Modules Section */}
                <div className="space-y-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Modul & Fitur Unggulan</h2>
                        <p className="text-slate-500 mt-1">Lima pilar utama Klikdesa dalam menghadirkan ekosistem desa cerdas</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* 1. Kesehatan (Rose) */}
                        <div className="group bg-white border border-rose-100 hover:border-rose-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="p-3 rounded-xl w-fit mb-4 bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Kesehatan & KB</h3>
                                <p className="text-xs text-slate-550 leading-relaxed mb-4">
                                    Pencegahan stunting terintegrasi, tracker KB (Keluarga Berencana), serta pendataan berkala tumbuh kembang anak posyandu secara digital.
                                </p>
                            </div>
                            <Link href="/klikdesa/kesehatan" className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 mt-auto">
                                Buka Modul Kesehatan →
                            </Link>
                        </div>

                        {/* 2. Kemiskinan (Amber) */}
                        <div className="group bg-white border border-amber-100 hover:border-amber-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="p-3 rounded-xl w-fit mb-4 bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Pemetaan Kemiskinan</h3>
                                <p className="text-xs text-slate-550 leading-relaxed mb-4">
                                    Analisis kesejahteraan masyarakat berbasis desil 1-10, mempermudah penyaluran program bantuan sosial agar tepat sasaran dan objektif.
                                </p>
                            </div>
                            <Link href="/klikdesa/kemiskinan" className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-auto">
                                Buka Pemetaan Desil →
                            </Link>
                        </div>

                        {/* 3. Pemberdayaan (Emerald) */}
                        <div className="group bg-white border border-emerald-100 hover:border-emerald-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="p-3 rounded-xl w-fit mb-4 bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Pemberdayaan & UMKM</h3>
                                <p className="text-xs text-slate-550 leading-relaxed mb-4">
                                    Integrasi database komoditas lokal dan pasar digital UMKM (Sidara) serta panduan inovasi Teknologi Tepat Guna (TTG) bagi industri desa.
                                </p>
                            </div>
                            <Link href="/klikdesa/pemberdayaan" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mt-auto">
                                Buka Sektor Pemberdayaan →
                            </Link>
                        </div>

                        {/* 4. Tata Kelola (Blue) */}
                        <div className="group bg-white border border-blue-100 hover:border-blue-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="p-3 rounded-xl w-fit mb-4 bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Tata Kelola & Surat</h3>
                                <p className="text-xs text-slate-550 leading-relaxed mb-4">
                                    Digitalisasi administrasi persuratan warga (Layanan Mandiri) dan loket penampung aduan serta aspirasi pembangunan warga secara real-time.
                                </p>
                            </div>
                            <Link href="/klikdesa/tata-kelola" className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 mt-auto">
                                Buka Layanan Mandiri →
                            </Link>
                        </div>

                        {/* 5. Kebencanaan (Cyan) */}
                        <div className="group bg-white border border-cyan-100 hover:border-cyan-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="p-3 rounded-xl w-fit mb-4 bg-cyan-50 text-cyan-600 group-hover:scale-105 transition-transform">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Ketahanan Bencana</h3>
                                <p className="text-xs text-slate-550 leading-relaxed mb-4">
                                    Sistem deteksi dini longsor (EWS), pantauan CCTV visual lereng, monitoring ketinggian sungai (hidrologi), serta integrasi data cuaca BMKG.
                                </p>
                            </div>
                            <Link href="/klikdesa/bencana" className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 mt-auto">
                                Buka Telemetri Bencana →
                            </Link>
                        </div>

                        {/* 6. Dashboard Telemetri IoT (Indigo) */}
                        <div className="group bg-white border border-indigo-100 hover:border-indigo-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="p-3 rounded-xl w-fit mb-4 bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Integrasi OpenData</h3>
                                <p className="text-xs text-slate-550 leading-relaxed mb-4">
                                    Menyediakan visualisasi data statistik OpenSID secara dinamis seperti tingkat keaktifan web desa dan sinkronisasi basis data desa.
                                </p>
                            </div>
                            <Link href="/statistik" className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 mt-auto">
                                Lihat Statistik OpenData →
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Footer Info */}
                <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                    <p>© 2026 Dispermades PPKB Kabupaten Banjarnegara. All Rights Reserved.</p>
                </div>

            </div>
        </div>
    );
}
