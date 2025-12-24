"use client";

import { Activity } from "lucide-react";
import { KontrasepsiKbDisplay } from "@/components/ui/custom/KontrasepsiKbDisplay";

export default function KontrasepsiKbPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-tertiary-100 rounded-full">
                        <Activity className="h-10 w-10 text-tertiary-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Akseptor KB</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik akseptor KB penduduk Desa Sijenggung
                    </p>
                </div>
                <KontrasepsiKbDisplay />
            </div>
        </div>
    );
}
