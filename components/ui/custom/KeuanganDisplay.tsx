"use client";

import * as React from "react";
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { YearSelector } from "@/components/ui/custom/YearSelector";

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

interface KeuanganDisplayProps {
    className?: string;
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

export function KeuanganDisplay({ className }: KeuanganDisplayProps) {
    const [tahun, setTahun] = React.useState<number>(2025);
    const [data, setData] = React.useState<KeuanganData | null>(null);
    const [loading, setLoading] = React.useState(true);

    // Calculate available years (2021 to current year)
    const currentYear = 2025;
    const availableYears = React.useMemo(() => {
        const years = [];
        for (let year = 2021; year <= currentYear; year++) {
            years.push(year);
        }
        return years;
    }, [currentYear]);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);

            // Create a timeout promise that rejects after 30 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout: API took too long")), 30000);
            });

            try {
                const result = await Promise.race([fetchKeuanganData(tahun.toString()), timeoutPromise]);
                setData(result as KeuanganData);
            } catch (error) {
                console.error("Failed to load keuangan data:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [tahun]);

    if (loading) {
        return (
            <div className={cn("w-full space-y-4", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Laporan Keuangan Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data || !data.data || data.data.length === 0) {
        return (
            <div className={cn("w-full space-y-4", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Laporan Keuangan Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data keuangan untuk tahun {tahun}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const keuanganData = data.data[0];
    const { pendapatan = {}, belanja = {}, pelaksanaan = {} } = keuanganData.attributes;

    // Convert object with numeric keys to array
    const pendapatanArray = Object.values(pendapatan);
    const belanjaArray = Object.values(belanja);
    const pelaksanaanArray = Object.values(pelaksanaan);

    // Filter out spacer rows, empty items, and items with null anggaran
    const filteredPendapatan = pendapatanArray.filter(
        (item) =>
            item.judul !== "ROW_SPACER" && item.anggaran !== null && item.anggaran !== undefined && item.anggaran !== ""
    );
    const filteredBelanja = belanjaArray.filter(
        (item) =>
            item.judul !== "ROW_SPACER" && item.anggaran !== null && item.anggaran !== undefined && item.anggaran !== ""
    );
    const filteredPelaksanaan = pelaksanaanArray.filter(
        (item) => item.judul !== "KEWAJIBAN" && item.judul !== "EKUITAS" && item.judul
    );

    // Get summary data
    const totalPendapatan = pelaksanaanArray.find((p) => p.judul === "PENDAPATAN");
    const totalBelanja = pelaksanaanArray.find((p) => p.judul === "BELANJA");
    const surplus = Math.ceil((totalPendapatan?.realisasi || 0) - (totalBelanja?.realisasi || 0));
    const surplusPercentage = totalPendapatan?.realisasi ? (surplus / totalPendapatan.realisasi) * 100 : 0;

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Year Selector */}
            <div className="flex items-center justify-center">
                <YearSelector
                    years={availableYears}
                    selectedYear={tahun}
                    onYearChange={setTahun}
                    className="max-w-4xl"
                />
            </div>

            {/* Summary Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Total Pendapatan */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-100 to-green-200 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-green-600">
                        <TrendingUp className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            TOTAL PENDAPATAN
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-green-900 mb-2">
                            {formatCurrency(totalPendapatan?.realisasi || 0)}
                        </div>
                        <p className="text-xs text-green-700">
                            {formatPercentage(totalPendapatan?.persen || 0)} dari{" "}
                            {formatCurrency(totalPendapatan?.anggaran || 0)}
                        </p>
                    </CardContent>
                </Card>

                {/* Total Belanja */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-red-100 to-red-200 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-red-600">
                        <TrendingDown className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            TOTAL BELANJA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-red-900 mb-2">
                            {formatCurrency(totalBelanja?.realisasi || 0)}
                        </div>
                        <p className="text-xs text-red-700">
                            {formatPercentage(totalBelanja?.persen || 0)} dari{" "}
                            {formatCurrency(totalBelanja?.anggaran || 0)}
                        </p>
                    </CardContent>
                </Card>

                {/* Surplus/Defisit */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-blue-600">
                        <PieChart className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                            <PieChart className="h-4 w-4" />
                            {surplus >= 0 ? "SURPLUS" : "DEFISIT"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-blue-900 mb-2">{formatCurrency(Math.abs(surplus))}</div>
                        <p className="text-xs text-blue-700">
                            Selisih Pendapatan vs Belanja{" "}
                            {new Intl.NumberFormat("id-ID", {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1,
                            }).format(surplusPercentage)}
                            %
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Three Column Comparison Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left: Pendapatan APBDes - Pendapatan */}
                <Card>
                    <CardContent>
                        {/* Table Header */}
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-foreground mb-1">Pendapatan APBDes {tahun}</h3>
                            <p className="text-xs text-muted-foreground">Pendapatan</p>
                        </div>

                        {/* Pendapatan Detail Rows */}
                        <div className="space-y-2">
                            {filteredPendapatan.map((item, index) => {
                                const anggaran = item.anggaran ? parseFloat(item.anggaran) : 0;
                                const realisasi = item.realisasi;
                                const percent = item.persen;

                                return (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-400 rounded-lg p-3"
                                    >
                                        {/* Title */}
                                        <div className="text-xs font-bold text-green-800 mb-2 truncate">
                                            {item.judul}
                                        </div>

                                        {/* Row 1: Labels */}
                                        <div className="flex justify-between text-[10px] font-semibold text-green-700 mb-1">
                                            <span>Anggaran</span>
                                            <span>Realisasi</span>
                                        </div>

                                        {/* Row 2: Values */}
                                        <div className="flex justify-between text-xs font-bold text-green-900 mb-2">
                                            <span>{formatCurrency(anggaran)}</span>
                                            <span>{formatCurrency(realisasi)}</span>
                                        </div>

                                        {/* Row 3: Progress Bar with percentage */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-semibold text-green-700 min-w-[40px]">
                                                {formatPercentage(percent)}
                                            </span>
                                            <div className="flex-1 bg-green-100 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Pembelanjaan APBDes - Pembelanjaan */}
                <Card>
                    <CardContent>
                        {/* Table Header */}
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-foreground mb-1">Pembelanjaan APBDes {tahun}</h3>
                            <p className="text-xs text-muted-foreground">Pembelanjaan</p>
                        </div>

                        {/* Belanja Detail Rows */}
                        <div className="space-y-2">
                            {filteredBelanja.map((item, index) => {
                                const anggaran = item.anggaran ? parseFloat(item.anggaran) : 0;
                                const realisasi = item.realisasi;
                                const percent = item.persen;

                                return (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-400 rounded-lg p-3"
                                    >
                                        {/* Title */}
                                        <div className="text-xs font-bold text-red-800 mb-2 truncate">{item.judul}</div>

                                        {/* Row 1: Labels */}
                                        <div className="flex justify-between text-[10px] font-semibold text-red-700 mb-1">
                                            <span>Anggaran</span>
                                            <span>Realisasi</span>
                                        </div>

                                        {/* Row 2: Values */}
                                        <div className="flex justify-between text-xs font-bold text-red-900 mb-2">
                                            <span>{formatCurrency(anggaran)}</span>
                                            <span>{formatCurrency(realisasi)}</span>
                                        </div>

                                        {/* Row 3: Progress Bar with percentage */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-semibold text-red-700 min-w-[40px]">
                                                {formatPercentage(percent)}
                                            </span>
                                            <div className="flex-1 bg-red-100 rounded-full h-2">
                                                <div
                                                    className="bg-red-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Center: Pelaksanaan APBDes - Pelaksanaan */}
                <Card>
                    <CardContent>
                        {/* Table Header */}
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-foreground mb-1">Pelaksanaan APBDes {tahun}</h3>
                            <p className="text-xs text-muted-foreground">Pelaksanaan</p>
                        </div>

                        {/* Pelaksanaan Detail Rows */}
                        <div className="space-y-2">
                            {filteredPelaksanaan.map((item, index) => {
                                const anggaran = item.anggaran ? parseFloat(item.anggaran) : 0;
                                const realisasi = item.realisasi;
                                const percent = item.persen;

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "border rounded-lg p-3",
                                            item.judul === "PENDAPATAN" &&
                                                "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400",
                                            item.judul === "BELANJA" &&
                                                "bg-gradient-to-r from-red-50 to-rose-50 border-red-400",
                                            item.judul === "PEMBIAYAAN" &&
                                                "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400"
                                        )}
                                    >
                                        {/* Title */}
                                        <div
                                            className={cn(
                                                "text-xs font-bold mb-2 truncate",
                                                item.judul === "PENDAPATAN" && "text-green-800",
                                                item.judul === "BELANJA" && "text-red-800",
                                                item.judul === "PEMBIAYAAN" && "text-blue-800"
                                            )}
                                        >
                                            {item.judul}
                                        </div>

                                        {/* Row 1: Labels */}
                                        <div
                                            className={cn(
                                                "flex justify-between text-[10px] font-semibold mb-1",
                                                item.judul === "PENDAPATAN" && "text-green-700",
                                                item.judul === "BELANJA" && "text-red-700",
                                                item.judul === "PEMBIAYAAN" && "text-blue-700"
                                            )}
                                        >
                                            <span>Anggaran</span>
                                            <span>Realisasi</span>
                                        </div>

                                        {/* Row 2: Values */}
                                        <div
                                            className={cn(
                                                "flex justify-between text-xs font-bold mb-2",
                                                item.judul === "PENDAPATAN" && "text-green-900",
                                                item.judul === "BELANJA" && "text-red-900",
                                                item.judul === "PEMBIAYAAN" && "text-blue-900"
                                            )}
                                        >
                                            <span>{formatCurrency(anggaran)}</span>
                                            <span>{formatCurrency(realisasi)}</span>
                                        </div>

                                        {/* Row 3: Progress Bar with percentage */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    "text-[10px] font-semibold min-w-[40px]",
                                                    item.judul === "PENDAPATAN" && "text-green-700",
                                                    item.judul === "BELANJA" && "text-red-700",
                                                    item.judul === "PEMBIAYAAN" && "text-blue-700"
                                                )}
                                            >
                                                {formatPercentage(percent)}
                                            </span>
                                            <div
                                                className={cn(
                                                    "flex-1 rounded-full h-2",
                                                    item.judul === "PENDAPATAN" && "bg-green-200",
                                                    item.judul === "BELANJA" && "bg-red-200",
                                                    item.judul === "PEMBIAYAAN" && "bg-blue-200"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "h-2 rounded-full transition-all",
                                                        item.judul === "PENDAPATAN" && "bg-green-600",
                                                        item.judul === "BELANJA" && "bg-red-600",
                                                        item.judul === "PEMBIAYAAN" && "bg-blue-600"
                                                    )}
                                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

