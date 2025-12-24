"use client";

import { TrendingUp } from "lucide-react";
import { KelasSosialDisplay } from "@/components/ui/custom/KelasSosialDisplay";

export default function KelasSosialPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                        <TrendingUp className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Kelas Sosial</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik kelas sosial penduduk Desa Sijenggung
                    </p>
                </div>
                <KelasSosialDisplay />
            </div>
        </div>
    );
}
