import { Calendar, Users, MapPin, Clock, Star, Heart, Music, Trophy, Gamepad2, Trees } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function KegiatanPage() {
    return (
        <div className="container mx-auto px-4 py-4">
            {/* Page Title */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                    <Calendar className="h-10 w-10 text-purple-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Kegiatan Masyarakat</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Informasi lengkap mengenai agenda kegiatan, program kemasyarakatan, dan partisipasi warga Desa
                    Sijenggung
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
                            <Calendar className="h-8 w-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Portal Kegiatan Sedang Disiapkan</h2>
                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Kami sedang mengembangkan portal kegiatan masyarakat yang interaktif untuk memberikan
                            informasi lengkap dan memfasilitasi partisipasi warga.
                        </p>

                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Activity Categories */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Kategori Kegiatan yang Akan Ditampilkan:
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Users className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Kemasyarakatan</h4>
                                        <p className="text-sm text-gray-600">Gotong royong dan rukun warga</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-[#c2c9df] rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Heart className="h-8 w-8 text-gray-900" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Sosial</h4>
                                        <p className="text-sm text-gray-600">Bantuan dan kegiatan sosial</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Music className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Budaya</h4>
                                        <p className="text-sm text-gray-600">Seni tradisional dan budaya lokal</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Trophy className="h-8 w-8 text-orange-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Olahraga</h4>
                                        <p className="text-sm text-gray-600">Kompetisi dan kegiatan olahraga</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Star className="h-8 w-8 text-red-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Keagamaan</h4>
                                        <p className="text-sm text-gray-600">Kegiatan ibadah dan keagamaan</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Trees className="h-8 w-8 text-teal-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Lingkungan</h4>
                                        <p className="text-sm text-gray-600">Kebersihan dan pelestarian</p>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Kalender Interaktif</h4>
                                    <Badge variant="secondary">Akan Hadir</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Jadwal lengkap dengan reminder</p>
                                </div>
                                <div className="bg-[#e6eaf3] p-4 rounded-lg text-center">
                                    <Users className="h-8 w-8 text-gray-900 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Pendaftaran Online</h4>
                                    <Badge variant="secondary">Akan Hadir</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Daftar kegiatan secara digital</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <Gamepad2 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Galeri Kegiatan</h4>
                                    <Badge variant="secondary">Akan Hadir</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Foto dan video dokumentasi</p>
                                </div>
                            </div>

                            {/* Upcoming Events */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">Agenda Mendatang</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Users className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Rapat Desa Bulanan</h4>
                                                <p className="text-sm text-gray-600">Pembahasan program kerja</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">5 Jan 2025</p>
                                            <p className="text-xs text-gray-500">09:00 WIB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#c2c9df] rounded-full flex items-center justify-center">
                                                <Heart className="h-5 w-5 text-gray-900" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Bakti Sosial</h4>
                                                <p className="text-sm text-gray-600">
                                                    Pembagian sembako warga tidak mampu
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">10 Jan 2025</p>
                                            <p className="text-xs text-gray-500">13:00 WIB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>Perkiraan selesai: Q1 2025</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sample Event Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="opacity-50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline">Kemasyarakatan</Badge>
                                <span className="text-xs text-gray-500">3 hari lagi</span>
                            </div>
                            <CardTitle className="text-lg">Kegiatan Masyarakat {i}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>5 Januari 2025</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>09:00 - 12:00 WIB</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>Balai Desa Sijenggung</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span>50 peserta terdaftar</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Activity Statistics */}
            <Card className="mt-4 opacity-50">
                <CardHeader>
                    <CardTitle>Statistik Kegiatan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">24</h3>
                            <p className="text-sm text-gray-600">Kegiatan Tahun Ini</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#c2c9df] rounded-full flex items-center justify-center mx-auto mb-2">
                                <Users className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">1,250</h3>
                            <p className="text-sm text-gray-600">Total Peserta</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Trophy className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">8</h3>
                            <p className="text-sm text-gray-600">Prestasi</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Star className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
                            <p className="text-sm text-gray-600">Rating Kepuasan</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

