"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, PieChart, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/custom/CustomButton";

interface KeuanganItem {
    anggaran: string | null;
    realisasi: number;
    persen: number;
    judul: string;
}

interface KeuanganData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            tahun: string;
            pendapatan: { [key: string]: KeuanganItem };
            belanja: { [key: string]: KeuanganItem };
            pelaksanaan: { [key: string]: KeuanganItem };
            laporan: string;
            updated_at: string;
        };
    }>;
}

// Function to fetch Keuangan data from API
const fetchKeuanganData = async (tahun: string): Promise<KeuanganData | null> => {
    try {
        const response = await fetch(`/api/keuangan?tahun=${tahun}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch keuangan data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch keuangan data:", error);
        return null;
    }
};

// Helper function to format currency
const formatCurrency = (value: number | string | null): string => {
    if (value === null || value === undefined) return "Rp 0";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num) || num === 0) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

// Helper function to format percentage
const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return "0,00%";
    return `${new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)}%`;
};

export function KeuanganSummary() {
    const [data, setData] = React.useState<KeuanganData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const currentYear = 2025;

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);

            // Create a timeout promise that rejects after 30 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout: API took too long")), 30000);
            });

            try {
                const result = await Promise.race([fetchKeuanganData(currentYear.toString()), timeoutPromise]);
                setData(result as KeuanganData);
            } catch (error) {
                console.error("Failed to load keuangan data:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Get summary data
    const pelaksanaanArray = Object.values(data?.data?.[0]?.attributes?.pelaksanaan || {});
    const totalPendapatan = pelaksanaanArray.find((p) => p.judul === "PENDAPATAN");
    const totalBelanja = pelaksanaanArray.find((p) => p.judul === "BELANJA");
    const surplus = (totalPendapatan?.realisasi || 0) - (totalBelanja?.realisasi || 0);

    return (
        <div className="space-y-4">
            {/* Summary Overview Cards */}
            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="relative overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : data && data.data && data.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Total Pendapatan */}
                        <Card className="relative overflow-hidden bg-gradient-to-br from-green-100 to-green-200 border-0 gap-0">
                            <div className="absolute -top-4 -right-4 opacity-10 text-green-600">
                                <TrendingUp className="h-32 w-32" />
                            </div>
                            <CardHeader className="pb-2 relative z-10 gap-0">
                                <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    TOTAL PENDAPATAN
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-2xl font-bold text-green-900 mb-2">
                                    {formatCurrency(totalPendapatan?.realisasi || 0)}
                                </div>
                                <p className="text-xs text-green-700">
                                    {formatPercentage(totalPendapatan?.persen || 0)} dari{" "}
                                    {formatCurrency(totalPendapatan?.anggaran || 0)}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Total Belanja */}
                        <Card className="relative overflow-hidden bg-gradient-to-br from-red-100 to-red-200 border-0 gap-0">
                            <div className="absolute -top-4 -right-4 opacity-10 text-red-600">
                                <TrendingDown className="h-32 w-32" />
                            </div>
                            <CardHeader className="pb-2 relative z-10 gap-0">
                                <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
                                    <TrendingDown className="h-4 w-4" />
                                    TOTAL BELANJA
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-2xl font-bold text-red-900 mb-2">
                                    {formatCurrency(totalBelanja?.realisasi || 0)}
                                </div>
                                <p className="text-xs text-red-700">
                                    {formatPercentage(totalBelanja?.persen || 0)} dari{" "}
                                    {formatCurrency(totalBelanja?.anggaran || 0)}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Surplus/Defisit */}
                        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 border-0 gap-0">
                            <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                                <PieChart className="h-32 w-32" />
                            </div>
                            <CardHeader className="pb-2 relative z-10 gap-0">
                                <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                                    <PieChart className="h-4 w-4" />
                                    {surplus >= 0 ? "SURPLUS" : "DEFISIT"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-2xl font-bold text-blue-900 mb-2">
                                    {formatCurrency(Math.abs(surplus))}
                                </div>
                                <p className="text-xs text-blue-700">Selisih Pendapatan vs Belanja</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* View More Button */}
                    <CustomButton variant="default" size="sm" className="w-full mt-3" asChild>
                        <Link href="/keuangan" className="flex items-center justify-center gap-2 text-white">
                            Laporan Selengkapnya
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </CustomButton>
                </>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                            <p className="font-semibold mb-2">Data tidak tersedia</p>
                            <p className="text-sm">Tidak dapat memuat data keuangan untuk tahun {currentYear}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
