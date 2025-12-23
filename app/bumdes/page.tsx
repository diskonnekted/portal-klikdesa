import { Briefcase, TrendingUp, Users, DollarSign, Target, Award, BarChart3, Building } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BumdesPage() {
    return (
        <div className="container mx-auto px-4 py-4">
            {/* Page Title */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-200 rounded-full mb-4">
                    <Briefcase className="h-10 w-10 text-gray-900" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">BUMDes Sijenggung</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Badan Usaha Milik Desa sebagai motor penggerak perekonomian masyarakat dan sumber pendapatan
                    Desa
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
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informasi BUMDes Sedang Disusun</h2>
                        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                            Kami sedang mempersiapkan informasi lengkap mengenai BUMDes Sijenggung untuk memberikan
                            transparansi dan peluang partisipasi masyarakat.
                        </p>

                        <div className="space-y-4 max-w-4xl mx-auto">
                            {/* BUMDes Units */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Unit Usaha BUMDes yang Akan Ditampilkan:
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Briefcase className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Jasa & Layanan</h4>
                                        <p className="text-sm text-gray-600">Pelayanan umum dan jasa Desa</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <DollarSign className="h-8 w-8 text-gray-900" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Retail & Toko</h4>
                                        <p className="text-sm text-gray-600">Usaha perdagangan dan ritel</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Users className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Wisata & Budaya</h4>
                                        <p className="text-sm text-gray-600">Pengembangan pariwisata lokal</p>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <BarChart3 className="h-8 w-8 text-blue-600 mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Laporan Keuangan</h4>
                                    <p className="text-sm text-gray-600 mb-3">Transparansi laporan:</p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>â€¢ Laporan laba rugi bulanan</li>
                                        <li>â€¢ Neraca keuangan triwulan</li>
                                        <li>â€¢ Cash flow dan arus kas</li>
                                        <li>â€¢ Pembagian SHU Desa</li>
                                    </ul>
                                </div>
                                <div className="bg-secondary-50 p-4 rounded-lg">
                                    <Target className="h-8 w-8 text-gray-900 mb-3" />
                                    <h4 className="font-semibold text-gray-900 mb-2">Peluang Investasi</h4>
                                    <p className="text-sm text-gray-600 mb-3">Kerjasama dan investasi:</p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>â€¢ Program kemitraan</li>
                                        <li>â€¢ Peluang usaha bersama</li>
                                        <li>â€¢ CSR dan sponsorship</li>
                                        <li>â€¢ Inkubasi bisnis lokal</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="bg-gradient-to-r from-secondary-50 to-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-4">Kinerja BUMDes</h3>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-medium text-gray-900">Pertumbuhan</h4>
                                        <Badge className="mt-1">+15%</Badge>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-secondary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-medium text-gray-900">Tenaga Kerja</h4>
                                        <Badge className="mt-1">25 Orang</Badge>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                                            <DollarSign className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-medium text-gray-900">Pendapatan</h4>
                                        <Badge className="mt-1">Rp 50M</Badge>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-medium text-gray-900">Prestasi</h4>
                                        <Badge className="mt-1">3 Penghargaan</Badge>
                                    </div>
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

            {/* Sample Business Units */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="opacity-50">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline">Unit Usaha</Badge>
                                <Badge className="bg-secondary-200 text-gray-900">Aktif</Badge>
                            </div>
                            <CardTitle className="text-lg">Unit Bisnis {i}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600">
                                    Deskripsi unit usaha BUMDes yang bergerak di bidang jasa dan perdagangan untuk
                                    meningkatkan kesejahteraan masyarakat...
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Omzet Bulanan:</span>
                                        <span className="font-medium">Rp 15Juta</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Pegawai:</span>
                                        <span className="font-medium">8 Orang</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Profit Margin:</span>
                                        <span className="font-medium">25%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* BUMDes Impact */}
            <Card className="mt-4 opacity-50">
                <CardHeader>
                    <CardTitle>Dampak BUMDes Bagi Masyarakat</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                            <p className="text-sm text-gray-600">Lapangan Kerja</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                <DollarSign className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Rp 500M</h3>
                            <p className="text-sm text-gray-600">Total Pendapatan</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Award className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">10</h3>
                            <p className="text-sm text-gray-600">Program CSR</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">20%</h3>
                            <p className="text-sm text-gray-600">Kontribusi PAD</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

