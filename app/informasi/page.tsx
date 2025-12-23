import { Info, Bell, Calendar, AlertTriangle, Newspaper, Download, Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PetaDisplay } from "@/components/ui/custom/PetaDisplay";

export default function InformasiPage() {
    return (
        <div className="container mx-auto px-4 py-4">
            {/* Page Title */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <Info className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Informasi & Pengumuman</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Pusat informasi resmi dan pengumuman penting dari Pemerintah Desa Sijenggung
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
                            <Bell className="h-8 w-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Portal Informasi Sedang Disiapkan</h2>
                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Kami sedang mengembangkan portal informasi yang komprehensif untuk memberikan akses mudah ke
                            berita, pengumuman, dan informasi penting Desa.
                        </p>

                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Content Types Preview */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Jenis Informasi yang Akan Tersedia:
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <AlertTriangle className="h-8 w-8 text-red-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Pengumuman Darurat</h4>
                                        <p className="text-sm text-gray-600">Informasi penting dan mendesak</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Newspaper className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Berita Desa</h4>
                                        <p className="text-sm text-gray-600">Aktivitas dan kegiatan terkini</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Calendar className="h-8 w-8 text-gray-900" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Agenda Kegiatan</h4>
                                        <p className="text-sm text-gray-600">Jadwal acara dan pertemuan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <Filter className="h-8 w-8 text-blue-600 mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Filter Kategori</h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Pencarian informasi berdasarkan kategori:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">Pemerintahan</Badge>
                                        <Badge variant="secondary">Pembangunan</Badge>
                                        <Badge variant="secondary">Sosial</Badge>
                                        <Badge variant="secondary">Keagamaan</Badge>
                                        <Badge variant="secondary">Lainnya</Badge>
                                    </div>
                                </div>
                                <div className="bg-secondary-50 p-4 rounded-lg">
                                    <Download className="h-8 w-8 text-gray-900 mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Dokumen Unduh</h4>
                                    <p className="text-sm text-gray-600 mb-3">Akses ke dokumen penting:</p>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>â€¢ APBDes dan laporan keuangan</p>
                                        <p>â€¢ Peraturan Desa</p>
                                        <p>â€¢ Formulir dan template</p>
                                        <p>â€¢ Dokumen publikasi</p>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Feature */}
                            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-3">Notifikasi Langsung</h3>
                                <p className="text-gray-600 text-center mb-4">
                                    Dapatkan informasi terbaru langsung melalui email atau WhatsApp
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <Badge variant="outline">Email Newsletter</Badge>
                                    <Badge variant="outline">WhatsApp Notifikasi</Badge>
                                    <Badge variant="outline">SMS Alert</Badge>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Info className="h-4 w-4" />
                                <span>Perkiraan selesai: Q1 2025</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Peta & Informasi Geografis */}
            <PetaDisplay className="mb-4" />

            {/* Sample Content Preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample Announcement */}
                <Card className="opacity-50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Badge variant="destructive">Penting</Badge>
                            <span className="text-xs text-gray-500">Baru saja</span>
                        </div>
                        <CardTitle className="text-lg">Contoh Pengumuman Penting</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                            Ini adalah contoh pengumuman penting yang akan ditampilkan di portal informasi Desa...
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Admin Desa</span>
                            <span>1 Jan 2025</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Sample News */}
                <Card className="opacity-50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">Berita</Badge>
                            <span className="text-xs text-gray-500">2 jam lalu</span>
                        </div>
                        <CardTitle className="text-lg">Kegiatan Gotong Royong</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                            Pelaksanaan gotong royong membersihkan lingkungan Desa dalam rangka...
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Humas Desa</span>
                            <span>1 Jan 2025</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Sample Event */}
                <Card className="opacity-50">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">Agenda</Badge>
                            <span className="text-xs text-gray-500">Besok</span>
                        </div>
                        <CardTitle className="text-lg">Rapat Desa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                            Rapat koordinasi pembahasan program kerja Desa tahun 2025...
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>09:00 - 12:00</span>
                            <span>2 Jan 2025</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

