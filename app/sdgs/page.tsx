"use client";

import { Globe } from "lucide-react";
import Image from "next/image";
import { SDGsDashboard } from "@/components/ui/custom/SDGsDashboard";

export default function SDGSPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center rounded-full">
                        <Image
                            src="/images/sdgs/logo.png"
                            alt="Logo SDGs"
                            width={256}
                            height={256}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Sustainable Development Goals (SDGs)</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tujuan Pembangunan Berkelanjutan (TPB) - 18 Goals untuk masa depan yang lebih baik
                    </p>
                </div>

                {/* SDGs Dashboard */}
                <SDGsDashboard
                    showProgress={true}
                    showDetails={true}
                    showCharts={true}
                    interactive={true}
                    compact={false}
                />

                {/* Additional Information */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 border rounded-lg p-6">
                        <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Tentang SDGs
                        </h3>
                        <p className="text-sm text-gray-700">
                            Sustainable Development Goals (SDGs) atau Tujuan Pembangunan Berkelanjutan adalah agenda
                            global dengan 17 tujuan yang disepakati oleh negara-negara anggota PBB.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 border rounded-lg p-6">
                        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Implementasi di Desa
                        </h3>
                        <p className="text-sm text-gray-700">
                            Desa Pembangunan Berkelanjutan adalah konsep yang mengintegrasikan prinsip SDGs ke
                            dalam perencanaan dan pembangunan tingkat Desa.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 border rounded-lg p-6">
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            monitoring & Evaluasi
                        </h3>
                        <p className="text-sm text-gray-700">
                            monitoring berkala terhadap pencapaian setiap tujuan melalui indikator yang telah ditetapkan
                            untuk memastikan keberlanjutan pembangunan.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

