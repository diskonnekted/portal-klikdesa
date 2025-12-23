import Link from "next/link";
import { Target, ArrowLeft, Eye, Lightbulb, CheckCircle, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VisiMisiPage() {
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
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Visi dan Misi Desa Sijenggung
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Arah dan tujuan pembangunan Desa Sijenggung untuk mewujudkan
                    masyarakat yang sejahtera dan berdaya saing.
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
                            <Eye className="h-8 w-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visi dan Misi Sedang Disusun</h2>
                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Kami sedang merumuskan visi dan misi yang komprehensif berdasarkan aspirasi masyarakat dan
                            arah pembangunan Desa.
                        </p>

                        <div className="space-y-4 max-w-3xl mx-auto">
                            {/* Vision Section Preview */}
                            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <Eye className="h-8 w-8 text-blue-600" />
                                    <h3 className="font-semibold text-gray-900 text-lg">Visi Desa</h3>
                                </div>
                                <div className="bg-white/70 p-4 rounded-lg">
                                    <p className="text-gray-600 italic text-center">
                                        &quot;Visi Desa Sijenggung akan disusun berdasarkan musyawarah masyarakat
                                        dan analisis kebutuhan pembangunan...&quot;
                                    </p>
                                </div>
                            </div>

                            {/* Mission Structure */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">Struktur Misi yang Akan Hadir:</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Pembangunan Infrastruktur</h4>
                                            <p className="text-sm text-gray-600">
                                                Peningkatan akses jalan, air bersih, dan fasilitas umum
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Pemberdayaan Masyarakat</h4>
                                            <p className="text-sm text-gray-600">
                                                Pelatihan ketrampilan dan pengembangan UMKM lokal
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Pendidikan dan Kesehatan</h4>
                                            <p className="text-sm text-gray-600">
                                                Peningkatan kualitas layanan pendidikan dan kesehatan
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Pelestarian Budaya</h4>
                                            <p className="text-sm text-gray-600">
                                                Melestarikan nilai-nilai tradisional dan seni lokal
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-gray-900">Tata Kelola Pemerintahan</h4>
                                            <p className="text-sm text-gray-600">
                                                Peningkatan transparansi dan akuntabilitas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Features */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Program Unggulan</h4>
                                    <p className="text-sm text-gray-600">Prioritas pembangunan 5 tahun ke depan</p>
                                </div>
                                <div className="bg-secondary-100 p-4 rounded-lg">
                                    <Users className="h-8 w-8 text-gray-900 mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Partisipasi Masyarakat</h4>
                                    <p className="text-sm text-gray-600">Cara warga dapat berkontribusi</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Lightbulb className="h-4 w-4" />
                                <span>Perkiraan selesai: Q1 2025</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Structure */}
            <Card className="opacity-50">
                <CardHeader>
                    <CardTitle>Komponen Halaman Visi dan Misi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Visi 2025-2030</h3>
                            <p className="text-gray-600 text-sm">
                                Pernyataan visi yang menggambarkan keadaan ideal Desa di masa depan
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Misi Strategis</h3>
                            <p className="text-gray-600 text-sm">
                                Rencana aksi dan program konkret untuk mencapai visi
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Tujuan Pembangunan</h3>
                            <p className="text-gray-600 text-sm">
                                Target khusus yang akan dicapai dalam periode tertentu
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Indikator Keberhasilan</h3>
                            <p className="text-gray-600 text-sm">
                                Metrik pengukuran keberhasilan implementasi visi-misi
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

