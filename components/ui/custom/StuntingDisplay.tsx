"use client";

import * as React from "react";
import {
    Baby,
    Heart,
    Activity,
    AlertCircle,
    CheckCircle2,
    TrendingDown,
    Users,
    Calendar,
    MapPin,
    BarChart3,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StuntingData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            scorecard: {
                dataAnak0sd2Tahun: {
                    jumlah: number;
                    persen: number;
                };
                posyandu: Array<{
                    id: number;
                    nama: string;
                    alamat: string;
                }>;
                JTRT: number;
                jumlahKekRisti: number;
                jumlahGiziBukanNormal: number;
                tikal: {
                    TD: number;
                    M: number;
                    K: number;
                    H: number;
                };
                ibu_hamil: {
                    _tahun: string;
                    ibuHamil: Array<unknown>;
                };
                bulanan_anak: {
                    _tahun: string;
                    bulananAnak: Array<unknown>;
                };
                kuartal: number;
                _tahun: string;
            };
            widgets: Array<{
                title: string;
                icon: string;
                "bg-color": string;
                "bg-icon": string;
                total: number;
            }>;
            chartStuntingUmurData: Array<{
                id: string;
                title: string;
                data: Array<{
                    name: string;
                    y: number | null;
                }>;
            }>;
            chartStuntingPosyanduData: {
                categories: string[];
                data: Array<{
                    name: string;
                    data: Array<number[]>;
                }>;
            };
        };
    }>;
}

interface StuntingDisplayProps {
    className?: string;
}

// Function to fetch Stunting data from API
const fetchStuntingData = async (): Promise<StuntingData | null> => {
    try {
        const response = await fetch(`/api/statistik/stunting`);

        if (!response.ok) {
            throw new Error(`Failed to fetch stunting data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch stunting data:", error);
        return null;
    }
};

export function StuntingDisplay({ className }: StuntingDisplayProps) {
    const [data, setData] = React.useState<StuntingData | null>(null);
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
                const result = await Promise.race([fetchStuntingData(), timeoutPromise]);
                setData(result as StuntingData);
            } catch (error) {
                console.error("Failed to load stunting data:", error);
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
                            <Baby className="h-5 w-5 text-primary" />
                            Data Stunting Desa
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
                            <Baby className="h-5 w-5 text-primary" />
                            Data Stunting Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data stunting saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stuntingInfo = data.data[0].attributes;
    const scorecard = stuntingInfo.scorecard;
    const widgets = stuntingInfo.widgets;
    const chartData = stuntingInfo.chartStuntingUmurData;

    // Get widget values
    const ibuHamilPeriksa = widgets.find((w) => w.title.includes("Ibu Hamil Periksa"))?.total || 0;
    const anakPeriksa = widgets.find((w) => w.title.includes("Anak Periksa"))?.total || 0;
    const totalIbuAnak = widgets.find((w) => w.title.includes("Ibu Hamil & Anak 0-23 Bulan"))?.total || 0;
    const normal = widgets.find((w) => w.title.includes("Normal"))?.total || 0;
    const risiko = widgets.find((w) => w.title.includes("Risiko"))?.total || 0;
    const stunting = widgets.find((w) => w.title.includes("Stunting"))?.total || 0;

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Baby className="h-5 w-5 text-primary" />
                        Data Stunting Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Tahun {scorecard._tahun} â€¢ Kuartal {scorecard.kuartal}
                    </p>
                </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Data */}
                <Card className="relative overflow-hidden bg-linear-to-br from-sky-100 to-sky-200 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-sky-600">
                        <Users className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-sky-800 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Total Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-sky-900 mb-2">{totalIbuAnak}</div>
                        <p className="text-xs text-sky-700">Ibu Hamil & Anak 0-23 Bulan</p>
                    </CardContent>
                </Card>

                {/* Normal */}
                <Card className="relative overflow-hidden bg-linear-to-br from-emerald-100 to-emerald-200 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-emerald-600">
                        <CheckCircle2 className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Normal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-emerald-900 mb-2">{normal}</div>
                        <p className="text-xs text-emerald-700">
                            {totalIbuAnak > 0 ? ((normal / totalIbuAnak) * 100).toFixed(1) : 0}% dari total
                        </p>
                    </CardContent>
                </Card>

                {/* Risiko Stunting */}
                <Card className="relative overflow-hidden bg-linear-to-br from-amber-100 to-amber-200 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-amber-600">
                        <AlertCircle className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Risiko Stunting
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-amber-900 mb-2">{risiko}</div>
                        <p className="text-xs text-amber-700">
                            {totalIbuAnak > 0 ? ((risiko / totalIbuAnak) * 100).toFixed(1) : 0}% dari total
                        </p>
                    </CardContent>
                </Card>

                {/* Stunting */}
                <Card className="relative overflow-hidden bg-linear-to-br from-rose-100 to-rose-200 border-0">
                    <div className="absolute -top-4 -right-4 opacity-10 text-rose-600">
                        <TrendingDown className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-rose-800 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            Stunting
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-rose-900 mb-2">{stunting}</div>
                        <p className="text-xs text-rose-700">
                            {totalIbuAnak > 0 ? ((stunting / totalIbuAnak) * 100).toFixed(1) : 0}% dari total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Checkup Data */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-primary" />
                            Pemeriksaan Bulan Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">Ibu Hamil</span>
                                <Baby className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{ibuHamilPeriksa}</p>
                            <p className="text-sm text-muted-foreground">ibu hamil periksa bulan ini</p>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">Anak</span>
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{anakPeriksa}</p>
                            <p className="text-sm text-muted-foreground">anak periksa bulan ini</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Statistik Tambahan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">KEK/Resiko</span>
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                            </div>
                            <p className="text-2xl font-bold text-amber-700">{scorecard.jumlahKekRisti}</p>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">Gizi Tidak Normal</span>
                                <TrendingDown className="h-5 w-5 text-rose-600" />
                            </div>
                            <p className="text-2xl font-bold text-rose-700">{scorecard.jumlahGiziBukanNormal}</p>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">JTRT</span>
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{scorecard.JTRT}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Posyandu List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Posyandu di Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Total: {scorecard.posyandu.length} posyandu</p>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scorecard.posyandu.map((pos) => (
                            <div key={pos.id} className="p-4 bg-muted/30 rounded-lg space-y-2">
                                <h4 className="font-semibold text-foreground">{pos.nama}</h4>
                                <p className="text-sm text-muted-foreground flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    {pos.alamat}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Age Group Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Data Stunting Berdasarkan Usia
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {chartData.map((chart) => (
                            <div key={chart.id} className="p-4 bg-muted/30 rounded-lg">
                                <h3 className="font-semibold mb-4">{chart.title}</h3>
                                <div className="space-y-3">
                                    {chart.data.map((item, index) => (
                                        <div key={index} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">{item.name}</span>
                                                <span className="font-semibold">{item.y !== null ? item.y : "-"}</span>
                                            </div>
                                            {item.y !== null && <Progress value={0} className="h-2" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

