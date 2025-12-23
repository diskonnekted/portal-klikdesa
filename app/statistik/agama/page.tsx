"use client";

import { Church, Users, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgamaDisplay } from "@/components/ui/custom/AgamaDisplay";

export default function AgamaPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                        <Church className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Data Agama</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik agama penduduk Desa Sijenggung
                    </p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* About Religion */}
                    <Card className="md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Church className="h-5 w-5 text-emerald-600" />
                                Data Agama
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Data agama adalah informasi penting dalam data kependudukan yang menunjukkan distribusi
                                agama penduduk dalam sebuah wilayah.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                                    <p>Menunjukkan distribusi agama penduduk</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                                    <p>Digunakan untuk perencanaan fasilitas ibadah</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                                    <p>Menunjang program toleransi dan kerukunan antar umat</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Religions & Others */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-blue-600" />
                                Agama Terbesar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Menampilkan 3 agama dengan jumlah penduduk terbesar dan kelompok lainnya.
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                    <span> Agama #1 (terbesar)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                    <span>Agama #2 (kedua)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                    <span>Agama #3 (ketiga)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-600 mt-2 flex-shrink-0" />
                                    <span>Lainnya (kelompok agama lainnya)</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Our Commitment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-green-600" />
                                Komitmen Kami
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <span>Data akurat dan terkini</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <span>Transparansi data publik</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <span>Kerukunan antar umat bergama</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Data Display */}
                <AgamaDisplay />

                {/* Action Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                        <CardHeader>
                            <CardTitle className="text-emerald-700">Fasilitas Ibadah</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Fasilitas ibadah untuk berbagai agama di Desa
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li>â€¢ Masjid & Mushola</li>
                                <li>â€¢ Gereja Kristen</li>
                                <li>â€¢ Gereja Katolik</li>
                                <li>â€¢ Pura, Vihara, Klenteng</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Program Keagamaan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Program peningkatan toleransi dan kerukunan antar umat bergama
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li>â€¢ Dialog antar agama</li>
                                <li>â€¢ Hari besar keagamaan</li>
                                <li>â€¢ Peringatan hari Toleransi</li>
                                <li>â€¢ Kegiatan sosial keagamaan</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="text-purple-700">Data Kependudukan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Pengelolaan data kependudukan yang akurat dan terpercaya
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li>â€¢ Pencatatan sipil</li>
                                <li>â€¢ Update data rutin</li>
                                <li>â€¢ Verifikasi data</li>
                                <li>â€¢ Layanan kependudukan</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
