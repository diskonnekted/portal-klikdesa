"use client";

import * as React from "react";
import { Users, UserCheck, MapPin, BarChart3, Home } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DptData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            rw: string;
            dusun: string;
            sex: number | null;
            total: number;
        };
    }>;
    meta: {
        pagination: {
            total: number;
            count: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    };
}

interface DptDisplayProps {
    className?: string;
}

// Function to fetch DPT data from API
const fetchDptData = async (): Promise<DptData | null> => {
    try {
        const response = await fetch(`/api/statistik/dpt`);

        if (!response.ok) {
            throw new Error(`Failed to fetch DPT data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch DPT data:", error);
        return null;
    }
};

export function DptDisplay({ className }: DptDisplayProps) {
    const [data, setData] = React.useState<DptData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);

            // Create a timeout promise that rejects after 30 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout: API took too long")), 30000);
            });

            try {
                const result = await Promise.race([fetchDptData(), timeoutPromise]);
                setData(result as DptData);
            } catch (error) {
                console.error("Failed to load DPT data:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Data Pemilih Desa
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
            <div className={cn("w-full space-y-6", className)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Data Pemilih Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data pemilih saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Group by dusun to get unique dusun data
    const dptByDusun = data.data.reduce(
        (acc, item) => {
            const dusun = item.attributes.dusun;
            if (!dusun) return acc;

            if (!acc[dusun]) {
                acc[dusun] = {
                    total: 0,
                    laki: 0,
                    perempuan: 0,
                    rw: new Set(),
                };
            }
            acc[dusun].total += item.attributes.total;
            if (item.attributes.sex === 1) acc[dusun].laki += item.attributes.total;
            if (item.attributes.sex === 2) acc[dusun].perempuan += item.attributes.total;
            if (item.attributes.rw) acc[dusun].rw.add(item.attributes.rw);
            return acc;
        },
        {} as Record<string, { total: number; laki: number; perempuan: number; rw: Set<string> }>
    );

    // Convert to array and sort
    const dusunArray = Object.entries(dptByDusun)
        .map(([name, stats]) => ({
            name,
            total: stats.total,
            laki: stats.laki,
            perempuan: stats.perempuan,
            rwCount: stats.rw.size,
        }))
        .sort((a, b) => b.total - a.total);

    // Get overall totals
    const totalDpt = dusunArray.reduce((sum, dusun) => sum + dusun.total, 0);
    const totalLaki = dusunArray.reduce((sum, dusun) => sum + dusun.laki, 0);
    const totalPerempuan = dusunArray.reduce((sum, dusun) => sum + dusun.perempuan, 0);
    const totalRw = new Set(data.data.map((item) => item.attributes.rw)).size;

    // Get color classes for each dusun
    const getDusunColor = (nama: string, type?: string) => {
        if (type === "others") return "from-slate-100 to-slate-200";
        if (type === "info") return "from-cyan-100 to-cyan-200";
        if (type === "empty") return "from-gray-100 to-gray-200";

        // Color based on dusun type
        const colors: { [key: string]: string } = {
            Badalan: "from-blue-100 to-blue-200",
            Janturan: "from-emerald-100 to-emerald-200",
            Kwarasan: "from-orange-100 to-orange-200",
            Pondok: "from-green-100 to-green-200",
            Rejowinangun: "from-purple-100 to-purple-200",
        };
        return colors[nama] || "from-teal-100 to-teal-200";
    };

    const getDusunTextColor = (nama: string, type?: string) => {
        if (type === "others") return "text-slate";
        if (type === "info") return "text-cyan";
        if (type === "empty") return "text-gray";
        if (["Badalan", "Janturan"].includes(nama)) return "blue";
        if (["Kwarasan", "Pondok"].includes(nama)) return "emerald";
        if (["Rejowinangun"].includes(nama)) return "orange";
        return "purple";
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Data Pemilih Tetap (DPT) Desa Sijenggung
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Distribusi pemilih tetap per dusun dan RW</p>
                </CardHeader>
            </Card>

            {/* Total Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Total DPT
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900">{totalDpt.toLocaleString("id-ID")}</div>
                        <p className="text-xs text-blue-700 mt-1">Seluruh pemilih</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Laki-laki
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-900">{totalLaki.toLocaleString("id-ID")}</div>
                        <p className="text-xs text-emerald-700 mt-1">
                            {totalDpt > 0 ? `${((totalLaki / totalDpt) * 100).toFixed(1)}%` : "0%"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-pink-700 flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Perempuan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-pink-900">{totalPerempuan.toLocaleString("id-ID")}</div>
                        <p className="text-xs text-pink-700 mt-1">
                            {totalDpt > 0 ? `${((totalPerempuan / totalDpt) * 100).toFixed(1)}%` : "0%"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Total RW
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-900">{totalRw}</div>
                        <p className="text-xs text-orange-700 mt-1">Wilayah RW</p>
                    </CardContent>
                </Card>
            </div>

            {/* Dusun Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dusunArray.map((dusun, index) => (
                    <Card
                        key={dusun.name}
                        className={`relative overflow-hidden bg-linear-to-br ${getDusunColor(index.toString())} border-0`}
                    >
                        <div className="absolute -top-4 -right-4 opacity-10">
                            <Home className="h-32 w-32" />
                        </div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle
                                className={`text-sm font-medium flex items-center gap-2 ${getDusunTextColor(index.toString())}-800`}
                            >
                                <MapPin className="h-4 w-4" />
                                Dusun {dusun.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className={`text-3xl font-bold mb-2 ${getDusunTextColor(index.toString())}-900`}>
                                {dusun.total.toLocaleString("id-ID")}
                            </div>
                            <div className="space-y-1">
                                <p className={`text-xs ${getDusunTextColor(index.toString())}-700`}>
                                    Laki-laki: {dusun.laki.toLocaleString("id-ID")}
                                </p>
                                <p className={`text-xs ${getDusunTextColor(index.toString())}-700`}>
                                    Perempuan: {dusun.perempuan.toLocaleString("id-ID")}
                                </p>
                                <p className={`text-xs ${getDusunTextColor(index.toString())}-600`}>
                                    {dusun.rwCount} RW
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detailed Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Detail Data DPT per Dusun
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {dusunArray.map((dusun) => (
                            <div
                                key={dusun.name}
                                className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Dusun {dusun.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {dusun.laki.toLocaleString("id-ID")} laki-laki,{" "}
                                        {dusun.perempuan.toLocaleString("id-ID")} perempuan
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-foreground">
                                        {dusun.total.toLocaleString("id-ID")}
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {totalDpt > 0 ? `${((dusun.total / totalDpt) * 100).toFixed(1)}%` : "0%"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

