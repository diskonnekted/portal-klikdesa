"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
    Bell, 
    ChevronLeft, 
    Check, 
    AlertTriangle, 
    Info, 
    Calendar, 
    Search,
    Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface NotificationItem {
    id: number;
    title: string;
    description: string;
    time: string;
    type: "announcement" | "info" | "warning";
    read: boolean;
}

export default function NotifikasiPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: 1,
            title: "Pengumuman Siaga Kebencanaan Lereng Dusun Sijenggung",
            description: "Dihimbau kepada seluruh warga Dusun Sijenggung untuk tetap waspada terhadap pergeseran lereng tanah sebesar 1.2mm yang terdeteksi oleh stasiun EWS Longsor. Harap selalu memantau stream CCTV bencana.",
            time: "5 menit lalu",
            type: "warning",
            read: false
        },
        {
            id: 2,
            title: "Update Realisasi Anggaran APBDes 2026",
            description: "Dispermades PPKB Banjarnegara telah menyetujui update laporan transparansi realisasi anggaran APBDes Tahap I tahun 2026. Laporan selengkapnya dapat diakses pada modul Tata Kelola Keuangan.",
            time: "1 jam lalu",
            type: "info",
            read: false
        },
        {
            id: 3,
            title: "Jadwal Imunisasi & Posyandu Melati Desa Sijenggung",
            description: "Diingatkan bagi ibu dan balita jadwal kegiatan Posyandu rutin bulanan akan diselenggarakan besok pagi pukul 08.00 WIB bertempat di Balai Posyandu Melati. Harap membawa KIA.",
            time: "3 jam lalu",
            type: "announcement",
            read: false
        },
        {
            id: 4,
            title: "Pembagian Bantuan Beras Cadangan Pangan Pemerintah",
            description: "Pemerintah Desa akan membagikan beras cadangan pangan besok pagi mulai pukul 09:00 WIB di Balai Desa. Harap membawa Kartu Keluarga dan KTP asli.",
            time: "1 hari lalu",
            type: "announcement",
            read: true
        },
        {
            id: 5,
            title: "Peringatan Dini Cuaca Ekstrem BMKG",
            description: "BMKG merilis peringatan potensi hujan lebat disertai angin kencang berdurasi singkat untuk wilayah Banjarmangu dan sekitarnya pada sore hari nanti.",
            time: "2 hari lalu",
            type: "warning",
            read: true
        }
    ]);

    const [activeTab, setActiveTab] = useState<"all" | "unread" | "warning" | "announcement">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Handle mark all as read
    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // Handle single read
    const toggleRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    // Handle delete
    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Filter and search logic
    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 n.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (activeTab === "all") return matchesSearch;
            if (activeTab === "unread") return matchesSearch && !n.read;
            if (activeTab === "warning") return matchesSearch && n.type === "warning";
            if (activeTab === "announcement") return matchesSearch && n.type === "announcement";
            return matchesSearch;
        });
    }, [notifications, activeTab, searchQuery]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-8 text-slate-800">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Beranda
                </Link>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                            <Bell className="h-7 w-7 text-cyan-600" />
                            Pusat Notifikasi Aplikasi
                        </h1>
                        <p className="text-slate-500 mt-1">Pemberitahuan terkini seputar administrasi, cuaca, EWS, dan info desa</p>
                    </div>
                    {unreadCount > 0 && (
                        <button 
                            onClick={markAllRead}
                            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:shadow-xs transition"
                        >
                            <Check className="h-4 w-4" /> Tandai Semua Terbaca
                        </button>
                    )}
                </div>

                {/* Controls and Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {[
                            { id: "all", label: "Semua" },
                            { id: "unread", label: `Belum Dibaca (${unreadCount})` },
                            { id: "warning", label: "Peringatan/Bahaya" },
                            { id: "announcement", label: "Pengumuman" }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                                    activeTab === tab.id 
                                        ? "bg-cyan-600 text-white shadow-xs" 
                                        : "bg-white border border-slate-200 text-slate-650 hover:bg-slate-50"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            type="text"
                            placeholder="Cari notifikasi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white border-slate-250 rounded-xl"
                        />
                    </div>
                </div>

                {/* Notification List */}
                <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif) => (
                            <div 
                                key={notif.id}
                                className={`relative border rounded-2xl p-5 transition flex gap-4 ${
                                    notif.read 
                                        ? "bg-white/80 border-slate-200" 
                                        : "bg-white border-l-4 border-l-cyan-500 border-y-slate-250 border-r-slate-250 shadow-xs"
                                }`}
                            >
                                {/* Left icon based on notification type */}
                                <div className="mt-1 flex-shrink-0">
                                    {notif.type === "warning" ? (
                                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                    ) : notif.type === "announcement" ? (
                                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                    ) : (
                                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                                            <Info className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>

                                {/* Body */}
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className={`text-sm font-bold ${notif.read ? "text-slate-650" : "text-slate-850"}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-[10px] font-semibold text-slate-400 font-mono whitespace-nowrap">
                                            {notif.time}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-550 leading-relaxed">
                                        {notif.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-3 pt-2">
                                        {!notif.read && (
                                            <button 
                                                onClick={() => toggleRead(notif.id)}
                                                className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg"
                                            >
                                                Tandai Dibaca
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(notif.id)}
                                            className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl py-12 text-center text-slate-400 space-y-2">
                            <Bell className="h-10 w-10 mx-auto text-slate-300 stroke-1" />
                            <p className="text-sm font-medium">Tidak ada notifikasi yang ditemukan</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
