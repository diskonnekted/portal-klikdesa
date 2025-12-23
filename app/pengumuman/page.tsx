import {
    Megaphone,
    Calendar,
    Clock,
    Tag,
    FileText,
    Bell,
    AlertCircle,
    CheckCircle,
    Users,
    Building,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PengumumanPage() {
    return (
        <div className="container mx-auto px-4 py-4">
            {/* Page Title */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <Megaphone className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Pengumuman Desa</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Informasi resmi dan pengumuman penting dari pemerintah Desa Sijenggung untuk seluruh warga
                </p>
            </div>

            {/* Main Content */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Halaman dalam Pengembangan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                            <Megaphone className="h-8 w-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Portal Pengumuman Sedang Disiapkan
                        </h2>
                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Kami sedang mengembangkan portal pengumuman yang terintegrasi untuk memberikan informasi
                            resmi dan penting kepada seluruh warga Desa Sijenggung.
                        </p>

                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Announcement Categories */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Kategori Pengumuman yang Akan Ditampilkan:
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <AlertCircle className="h-8 w-8 text-red-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Penting & Darurat</h4>
                                        <p className="text-sm text-gray-600">Info krusial & kejadian darurat</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Building className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Pemerintahan</h4>
                                        <p className="text-sm text-gray-600">Kebijakan & program Desa</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Layanan</h4>
                                        <p className="text-sm text-gray-600">Info layanan publik & admin</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Calendar className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Acara & Agenda</h4>
                                        <p className="text-sm text-gray-600">Jadwal kegiatan resmi</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Users className="h-8 w-8 text-orange-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Kemasyarakatan</h4>
                                        <p className="text-sm text-gray-600">Info untuk warga & komunitas</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FileText className="h-8 w-8 text-teal-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Lelang & Lowongan</h4>
                                        <p className="text-sm text-gray-600">Info tender & kesempatan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <Bell className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Notifikasi Real-time</h4>
                                    <Badge variant="secondary">Akan Hadir</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Alert langsung ke perangkat</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg text-center">
                                    <Tag className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Kategori & Filter</h4>
                                    <Badge variant="secondary">Akan Hadir</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Cari pengumuman per kategori</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Dokumen Terlampir</h4>
                                    <Badge variant="secondary">Akan Hadir</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Download file & lampiran</p>
                                </div>
                            </div>

                            {/* Recent Announcements */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">Pengumuman Terkini</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                <AlertCircle className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Libur Nasional & Cuti Bersama
                                                </h4>
                                                <p className="text-sm text-gray-600">Penyesuaian jam kerja Desa</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">28 Des 2024</p>
                                            <Badge variant="destructive" className="text-xs">
                                                Penting
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Building className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Pembukaan Pendaftaran Bantuan
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Program bantuan untuk warga tidak mampu
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">25 Des 2024</p>
                                            <Badge variant="outline" className="text-xs">
                                                Layanan
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Rapat Rutin Bulanan</h4>
                                                <p className="text-sm text-gray-600">Undangan rapat LPMDesa</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">20 Des 2024</p>
                                            <Badge variant="secondary" className="text-xs">
                                                Agenda
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Megaphone className="h-4 w-4" />
                                <span>Perkiraan selesai: Q1 2025</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sample Announcement Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="opacity-50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline">Pemerintahan</Badge>
                                <span className="text-xs text-gray-500">3 hari lalu</span>
                            </div>
                            <CardTitle className="text-lg">Pengumuman Penting {i}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>25 Desember 2024</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>10:00 WIB</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Tag className="h-4 w-4" />
                                    <span>Kategori: Layanan Publik</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span>1.2k kali dilihat</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Announcement Statistics */}
            <Card className="mt-4 opacity-50">
                <CardHeader>
                    <CardTitle>Statistik Pengumuman</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">156</h3>
                            <p className="text-sm text-gray-600">Total Pengumuman</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">12</h3>
                            <p className="text-sm text-gray-600">Pengumuman Penting</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">8.5k</h3>
                            <p className="text-sm text-gray-600">Total Dibaca</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">2.1k</h3>
                            <p className="text-sm text-gray-600">Pembaca Aktif</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

