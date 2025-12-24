"use client";

import { Accessibility, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisabilitasDisplay } from "@/components/ui/custom/DisabilitasDisplay";

export default function DisabilitasPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                        <Accessibility className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Data Disabilitas</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik penyandang disabilitas Desa Sijenggung
                    </p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* About Disability */}
                    <Card className="md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Accessibility className="h-5 w-5 text-blue-600" />
                                Tentang Disabilitas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Data ini mencakup informasi mengenai jumlah dan jenis disabilitas yang dialami oleh penduduk.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                    <p>Identifikasi kebutuhan khusus</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                                    <p>Perencanaan layanan inklusif</p>
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
                                    <span>Pemberdayaan penyandang disabilitas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <span>Aksesibilitas layanan publik</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Data Display */}
                <DisabilitasDisplay />
            </div>
        </div>
    );
}
