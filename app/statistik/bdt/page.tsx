"use client";

import { Database, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BDTDisplay } from "@/components/ui/custom/BDTDisplay";

export default function BdtPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full">
                        <Database className="h-10 w-10 text-amber-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Data BDT</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik BDT (Basis Data Terpadu) penduduk Desa Sijenggung
                    </p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* About BDT */}
                    <Card className="md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-amber-600" />
                                Tentang BDT
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Basis Data Terpadu (BDT) adalah sistem data elektronik yang memuat informasi sosial, ekonomi, dan demografi.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                                    <p>Acuan penetapan sasaran program perlindungan sosial</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                                    <p>Penanggulangan kemiskinan</p>
                                </div>
                            </div>
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
                                    <span>Penyaluran bantuan tepat sasaran</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <span>Verifikasi data berkala</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Data Display */}
                <BDTDisplay />
            </div>
        </div>
    );
}
