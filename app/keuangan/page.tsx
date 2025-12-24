"use client";

import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeuanganDisplay } from "@/components/ui/custom/KeuanganDisplay";
import { KeuanganMultiYear } from "@/components/ui/custom/KeuanganMultiYear";
import { KeuanganDetailMultiYear } from "@/components/ui/custom/KeuanganDetailMultiYear";
import { DecorativeSeparator } from "@/components/ui/custom/DecorativeSeparator";

export default function KeuanganPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                        <DollarSign className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Laporan Keuangan Desa</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Transparansi pengelolaan keuangan Desa untuk memastikan akuntabilitas dan keterbukaan
                        kepada masyarakat
                    </p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* About Financial Reports */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                Tentang Laporan Keuangan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Laporan Keuangan Desa atau APBDes (Anggaran Pendapatan dan Belanja Desa) adalah dokumen
                                yang menyajikan informasi tentang rencana dan realisasi pendapatan, belanja, dan
                                pembiayaan desa.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <p>Mencakup pendapatan, belanja, dan pembiayaan desa</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <p>Menunjukkan tingkat realisasi anggaran</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <p>Memberikan transparansi penggunaan dana desa</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Components */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                Komponen Utama
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                    <span>PENDAPATAN (Sumber Dana)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                    <span>BELANJA (Pengeluaran)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                    <span>PEMBIAYAAN (Transfer)</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Our Commitment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                                Komitmen Kami
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                                    <span>Transparansi penuh</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                                    <span>Akuntabilitas publik</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                                    <span>Update berkala</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Data Display */}
                <KeuanganDisplay />

                <DecorativeSeparator />

                {/* Multi-Year Comparison Analysis */}
                <KeuanganMultiYear />

                <DecorativeSeparator />

                {/* Detailed Multi-Year Analysis */}
                <KeuanganDetailMultiYear />

                {/* Action Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="text-green-700">APBDes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Anggaran Pendapatan dan Belanja Desa tahunan yang menjadi dasar pengelolaan keuangan
                                desa
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li>â€¢ Rencana pendapatan desa</li>
                                <li>â€¢ Alokasi belanja per bidang</li>
                                <li>â€¢ Kebijakan pembiayaan</li>
                                <li>â€¢ Jadwal pencairan</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Realisasi Anggaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Laporan pelaksanaan anggaran yang menunjukkan tingkat pencapaian target pendapatan dan
                                realisasi belanja
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li>â€¢ Realisasi pendapatan</li>
                                <li>â€¢ Realisasi belanja per bidang</li>
                                <li>â€¢ Tingkat penyerapan anggaran</li>
                                <li>â€¢ Laporan triwulan</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="text-purple-700">Pertanggungjawaban</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Laporan pertanggungjawaban (LPJ) yang merupakan pertanggungjawaban kepala desa atas
                                pelaksanaan APBDes
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li>â€¢ Laporan operasional</li>
                                <li>â€¢ Laporan Keuangan</li>
                                <li>â€¢ Neraca desa</li>
                                <li>â€¢ Catatan atas laporan keuangan</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

