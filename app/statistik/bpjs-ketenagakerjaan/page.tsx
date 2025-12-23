"use client";

import { Briefcase } from "lucide-react";
import { BPJSKetenagakerjaanDisplay } from "@/components/ui/custom/BPJSKetenagakerjaanDisplay";

export default function BpjsKetenagakerjaanPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                        <Briefcase className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary">Data BPJS Ketenagakerjaan</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Data statistik kepesertaan BPJS Ketenagakerjaan penduduk Desa Sijenggung
                    </p>
                </div>
                <BPJSKetenagakerjaanDisplay />
            </div>
        </div>
    );
}
