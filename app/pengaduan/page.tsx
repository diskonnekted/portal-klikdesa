"use client";

import { MessageSquare, Phone, Mail, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PengaduanDisplay } from "@/components/ui/custom/PengaduanDisplay";

export default function PengaduanPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                        <MessageSquare className="h-10 w-10 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Pengaduan Masyarakat</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
        Salurkan aspirasi, keluhan, dan saran Anda untuk kemajuan Desa Sijenggung. Setiap masukan
        Anda penting bagi kami.
      </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Response Time */}
                    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-700 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Darurat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Untuk pengaduan yang memerlukan penanganan segera
                            </p>
                            <Badge className="bg-red-600">Respon: 1x24 Jam</Badge>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                        <CardHeader>
                            <CardTitle className="text-yellow-700 flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Prioritas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Pengaduan yang memerlukan perhatian khusus
                            </p>
                            <Badge className="bg-yellow-600">Respon: 3x24 Jam</Badge>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="text-green-700 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Reguler
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">Pengaduan umum dan saran perbaikan</p>
                            <Badge className="bg-green-600">Respon: 7x24 Jam</Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Pengaduan Display */}
                <PengaduanDisplay />

                {/* Contact Information */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-700">Cara Menghubungi Kami</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Phone className="h-8 w-8 text-red-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Hotline Darurat</h4>
                                <p className="text-lg font-bold text-red-600 mb-1">112</p>
                                <p className="text-sm text-gray-600">Untuk keadaan darurat</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Phone className="h-8 w-8 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Kantor Desa</h4>
                                <p className="text-lg font-bold text-blue-600 mb-1">0274-xxxxxx</p>
                                <p className="text-sm text-gray-600">Senin - Jumat, 08:00-15:00</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Mail className="h-8 w-8 text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Email Resmi</h4>
                                <p className="text-lg font-bold text-green-600 mb-1">info@desa.sch.id</p>
                                <p className="text-sm text-gray-600">Respon 1x24 jam</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kategori Pengaduan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                    <span className="text-sm text-gray-700">Infrastruktur Jalan</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                    <span className="text-sm text-gray-700">Pelayanan Publik</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                    <span className="text-sm text-gray-700">Kebersihan Lingkungan</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                    <span className="text-sm text-gray-700">Keamanan & Ketertiban</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                    <span className="text-sm text-gray-700">Administrasi Desa</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Penting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>Semua pengaduan akan ditindaklanjuti sesuai prosedur</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>Data pribadi pelapor dijaga kerahasiaannya</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>Gunakan bahasa yang sopan dan jelas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                    <span>Sertakan foto/bukti untuk mempercepat penanganan</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

