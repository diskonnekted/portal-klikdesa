"use client";

import { CreditCard } from "lucide-react";
import { KepemilikanKIADisplay } from "@/components/ui/custom/KepemilikanKIADisplay";

export default function KepemilikanKIAPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full">
                        <CreditCard className="h-10 w-10 text-pink-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Kepemilikan KIA</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik kepemilikan KIA (Kartu Identitas Anak) penduduk Desa Sijenggung
                    </p>
                </div>
                <KepemilikanKIADisplay />
            </div>
        </div>
    );
}
