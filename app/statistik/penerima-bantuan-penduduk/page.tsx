"use client";

import { Gift } from "lucide-react";
import { PenerimaBantuanPendudukDisplay } from "@/components/ui/custom/PenerimaBantuanPendudukDisplay";

export default function PenerimaBantuanPendudukPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                        <Gift className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Penerima Bantuan Penduduk</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik penduduk penerima bantuan di Desa Sijenggung
                    </p>
                </div>
                <PenerimaBantuanPendudukDisplay />
            </div>
        </div>
    );
}
