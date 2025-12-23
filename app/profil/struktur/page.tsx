import Link from "next/link";
import { Users, ArrowLeft, User, Mail, Phone, Building, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function StrukturPage() {
    // Real Lurah data
    const lurah = {
        nama: "Suyono",
        jabatan: "Kepala Desa",
        periode: "2020-2026",
        foto: "https://ui-avatars.com/api/?name=Suyono&background=0D8ABC&color=fff&size=256",
    };

    return (
        <div className="container mx-auto px-4 py-4">
            {/* Back button */}
            <Link href="/profil">
                <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Profil Desa
                </Button>
            </Link>

            {/* Page Title */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                    <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Struktur Organisasi Desa Sijenggung</h1>
                <p className="text-xl text-gray-600">
                    Susunan perangkat pemerintahan Desa yang bertugas melayani masyarakat
                </p>
            </div>

            {/* Lurah Card - Main Leadership */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Pimpinan Desa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative w-48 h-48 flex-shrink-0">
                                    <Image
                                        src={lurah.foto}
                                        alt={lurah.nama}
                                        fill
                                        className="object-cover rounded-lg shadow-lg"
                                        sizes="(max-width: 768px) 100vw, 200px"
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{lurah.nama}</h2>
                                    <p className="text-lg text-gray-700 mb-3">{lurah.jabatan}</p>
                                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full">
                                        <Calendar className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm font-medium">Periode {lurah.periode}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Note about structure */}
                        <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                            <div className="flex items-start gap-2">
                                <Building className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-amber-900 mb-1">Struktur Organisasi Lengkap</h3>
                                    <p className="text-sm text-amber-800">
                                        Data lengkap struktur organisasi Desa Sijenggung (Sekretaris, Kasi, Kaur,
                                        dan Kepala Dusun) sedang dalam proses penyusunan dan akan segera tersedia.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <Users className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                        <h3 className="font-semibold mb-1">Total Perangkat</h3>
                        <p className="text-2xl font-bold text-purple-600">20+</p>
                        <p className="text-xs text-gray-600">orang</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Building className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-semibold mb-1">Dusun</h3>
                        <p className="text-2xl font-bold text-blue-600">9</p>
                        <p className="text-xs text-gray-600">dusun</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <User className="h-10 w-10 text-[#3a4d74] mx-auto mb-3" />
                        <h3 className="font-semibold mb-1">RW/RT</h3>
                        <p className="text-2xl font-bold text-[#3a4d74]">20/47</p>
                        <p className="text-xs text-gray-600">RW/RT</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Placeholder */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-xl">Jenjang Struktural Pemerintahan Desa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                            <Building className="h-8 w-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Struktur Organisasi Sedang Disusun
                        </h2>
                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Kami sedang mempersiapkan data lengkap mengenai struktur organisasi Desa Sijenggung
                            untuk memberikan informasi yang akurat.
                        </p>

                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Organizational Structure Preview */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">Struktur yang Akan Ditampilkan:</h3>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg border-l-4 border-purple-600">
                                        <h4 className="font-semibold text-gray-900">Kepala Desa (Lurah)</h4>
                                        <p className="text-sm text-gray-600">
                                            Pimpinan tertinggi pemerintahan Desa
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-600">
                                        <h4 className="font-semibold text-gray-900">Sekretaris Desa</h4>
                                        <p className="text-sm text-gray-600">Koordinator administrasi dan keuangan</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border-l-4 border-[#3a4d74]">
                                        <h4 className="font-semibold text-gray-900">Kepala Seksi (Kasi)</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>â€¢ Kasi Pemerintahan</p>
                                            <p>â€¢ Kasi Kesejahteraan</p>
                                            <p>â€¢ Kasi Pelayanan</p>
                                            <p>â€¢ Kasi Keuangan</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border-l-4 border-orange-600">
                                        <h4 className="font-semibold text-gray-900">Kepala Urusan (Kaur)</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>â€¢ Kaur Tata Usaha dan Umum</p>
                                            <p>â€¢ Kaur Perencanaan</p>
                                            <p>â€¢ Kaur Keuangan</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border-l-4 border-teal-600">
                                        <h4 className="font-semibold text-gray-900">Kepala Dusun</h4>
                                        <p className="text-sm text-gray-600">Koordinator wilayah administratif dusun</p>
                                    </div>
                                </div>
                            </div>

                            {/* Staff Information Features */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Profil Lengkap</h4>
                                    <p className="text-sm text-gray-600">Foto dan biodata perangkat Desa</p>
                                </div>
                                <div className="bg-[#e6eaf3] p-4 rounded-lg text-center">
                                    <Phone className="h-8 w-8 text-gray-900 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Kontak</h4>
                                    <p className="text-sm text-gray-600">Informasi telepon dan email</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <Mail className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Jadwal Layanan</h4>
                                    <p className="text-sm text-gray-600">Waktu operasional dan tugas</p>
                                </div>
                            </div>

                            {/* Organizational Chart Preview */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">Bagan Organisasi Interaktif</h3>
                                <div className="bg-white/70 p-4 rounded-lg">
                                    <p className="text-gray-600 text-center">
                                        Visualisasi struktur organisasi dengan hubungan hierarkis yang jelas dan
                                        informatif
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Building className="h-4 w-4" />
                                <span>Perkiraan selesai: Q1 2025</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sample Staff Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                        <div className="p-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4" />
                                <h3 className="font-semibold text-gray-900">Nama Perangkat {i}</h3>
                                <p className="text-sm text-gray-600 mb-2">Jabatan Contoh</p>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div className="flex items-center gap-1 justify-center">
                                        <Phone className="h-3 w-3" />
                                        <span>08xx-xxxx-xxxx</span>
                                    </div>
                                    <div className="flex items-center gap-1 justify-center">
                                        <Mail className="h-3 w-3" />
                                        <span>email@contoh.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

