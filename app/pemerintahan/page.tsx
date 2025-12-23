import { Building, Users, Award, FileText, Calendar, Mail, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PemerintahanPage() {
    return (
        <div className="container mx-auto px-4 py-4">
            {/* Page Title */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <Building className="h-10 w-10 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Pemerintahan Desa Sijenggung</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Struktur organisasi, program kerja, dan layanan pemerintahan Desa untuk masyarakat
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
                            <Building className="h-8 w-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Informasi Pemerintahan Sedang Disusun
                        </h2>
                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Kami sedang mempersiapkan informasi lengkap mengenai pemerintahan Desa Sijenggung untuk
                            memberikan transparansi dan akses informasi kepada masyarakat.
                        </p>

                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Features Preview */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">Fitur yang Akan Hadir:</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Struktur Organisasi</h4>
                                                <p className="text-sm text-gray-600">
                                                    Hierarki dan tugas perangkat Desa
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Award className="h-5 w-5 text-gray-900 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Program Kerja</h4>
                                                <p className="text-sm text-gray-600">Prioritas pembangunan Desa</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Produk Hukum</h4>
                                                <p className="text-sm text-gray-600">
                                                    Peraturan dan keputusan Desa
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Agenda Kegiatan</h4>
                                                <p className="text-sm text-gray-600">Jadwal kegiatan pemerintahan</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Mail className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Layanan Online</h4>
                                                <p className="text-sm text-gray-600">Pengajuan surat dan permohonan</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Kontak Darurat</h4>
                                                <p className="text-sm text-gray-600">Hotline layanan masyarakat</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Perangkat Desa</h4>
                                    <Badge variant="secondary">Dalam Proses</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Data kepegawaian sedang diverifikasi</p>
                                </div>
                                <div className="bg-[#e6eaf3] p-4 rounded-lg text-center">
                                    <FileText className="h-8 w-8 text-gray-900 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Dokumen</h4>
                                    <Badge variant="secondary">Dalam Proses</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Dokumen sedang diarsipkan</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Agenda</h4>
                                    <Badge variant="secondary">Dalam Proses</Badge>
                                    <p className="text-sm text-gray-600 mt-2">Jadwal sedang disusun</p>
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

            {/* Preview Structure */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="opacity-50">
                    <CardHeader>
                        <CardTitle>Struktur Pemerintahan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h4 className="font-semibold">Kepala Desa</h4>
                                <p className="text-sm text-gray-600">Pimpinan eksekutif Desa</p>
                            </div>
                            <div className="border-l-4 border-[#3a4d74] pl-4">
                                <h4 className="font-semibold">Sekretaris Desa</h4>
                                <p className="text-sm text-gray-600">Administrasi dan keuangan</p>
                            </div>
                            <div className="border-l-4 border-purple-600 pl-4">
                                <h4 className="font-semibold">Kepala Seksi</h4>
                                <p className="text-sm text-gray-600">Koordinator bidang</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="opacity-50">
                    <CardHeader>
                        <CardTitle>Layanan Pemerintahan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Pelayanan Administrasi</h4>
                                    <p className="text-xs text-gray-600">Surat dan dokumen</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#c2c9df] rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-gray-900" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Konsultasi Masyarakat</h4>
                                    <p className="text-xs text-gray-600">Aspirasi warga</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Musyawarah Desa</h4>
                                    <p className="text-xs text-gray-600">Forum pengambilan keputusan</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

