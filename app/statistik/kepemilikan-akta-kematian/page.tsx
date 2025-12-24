"use client";

import { FileText } from "lucide-react";
import { KepemilikanAktaKematianDisplay } from "@/components/ui/custom/KepemilikanAktaKematianDisplay";

export default function KepemilikanAktaKematianPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
                        <FileText className="h-10 w-10 text-gray-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Kepemilikan Akta Kematian</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik kepemilikan akta kematian penduduk Desa Sijenggung
                    </p>
                </div>
                <KepemilikanAktaKematianDisplay />
            </div>
        </div>
    );
}
