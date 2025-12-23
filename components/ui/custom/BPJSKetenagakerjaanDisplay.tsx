"use client";

import * as React from "react";
import { BarChart3, Shield, TrendingUp, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BPJSKetenagakerjaanData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            nama: string;
            jumlah: number;
            laki: number;
            perempuan: number;
            persen?: string;
            persen1?: string;
            persen2?: string;
            no?: string;
        };
    }>;
}

interface BPJSKetenagakerjaanDisplayProps {
    className?: string;
}

const fetchBPJSKetenagakerjaanData = async (): Promise<BPJSKetenagakerjaanData | null> => {
    try {
        const response = await fetch(`/api/statistik/bpjs-ketenagakerjaan`);
        if (!response.ok) throw new Error(`Failed to fetch bpjs-ketenagakerjaan data: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch bpjs-ketenagakerjaan data:", error);
        return null;
    }
};

export function BPJSKetenagakerjaanDisplay({ className }: BPJSKetenagakerjaanDisplayProps) {
    const [data, setData] = React.useState<BPJSKetenagakerjaanData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);
            try {
                const result = await Promise.race([
                    fetchBPJSKetenagakerjaanData(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000)),
                ]);
                setData(result as BPJSKetenagakerjaanData);
            } catch (error) {
                console.error("Failed to load bpjs-ketenagakerjaan data:", error);
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
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Data BPJS Ketenagakerjaan
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
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Data BPJS Ketenagakerjaan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data BPJS Ketenagakerjaan saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");
    const jumlahData = data.data.find((item) => item.attributes.nama === "JUMLAH");
    const belumMengisiData = data.data.find((item) => item.attributes.nama === "BELUM MENGISI");

    const getBPJSColor = (nama: string) => {
        switch (nama) {
            case "KARYAWAN SWASTA":
                return "from-blue-100 to-blue-200";
            case "PERANGKAT DESA":
                return "from-green-100 to-green-200";
            case "TOTAL":
                return "from-purple-100 to-purple-200";
            case "JUMLAH":
                return "from-emerald-100 to-emerald-200";
            case "BELUM MENGISI":
                return "from-gray-100 to-gray-200";
            default:
                return "from-orange-100 to-orange-200";
        }
    };

    const getBPJSIcon = (nama: string) => {
        switch (nama) {
            case "KARYAWAN SWASTA":
                return Briefcase;
            case "PERANGKAT DESA":
                return Shield;
            case "TOTAL":
                return TrendingUp;
            case "JUMLAH":
                return Shield;
            case "BELUM MENGISI":
                return Users;
            default:
                return Shield;
        }
    };

    const getTextColor = (nama: string) => {
        switch (nama) {
            case "KARYAWAN SWASTA":
                return "text-blue";
            case "PERANGKAT DESA":
                return "text-green";
            case "TOTAL":
                return "text-purple";
            case "JUMLAH":
                return "text-emerald";
            case "BELUM MENGISI":
                return "text-gray";
            default:
                return "text-orange";
        }
    };

    // Get worker type data (excluding TOTAL, JUMLAH, BELUM MENGISI)
    const workerTypeData = data.data.filter(
        (item) => !["TOTAL", "JUMLAH", "BELUM MENGISI"].includes(item.attributes.nama)
    );

    return (
        <div className={cn("w-full space-y-6", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Data BPJS Ketenagakerjaan
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Data statistik kepesertaan BPJS Ketenagakerjaan Desa
                    </p>
                </CardHeader>
            </Card>

            {/* Worker type cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {workerTypeData.map((card) => {
                    const IconComponent = getBPJSIcon(card.attributes.nama);
                    const colorClass = getBPJSColor(card.attributes.nama);
                    const textColor = getTextColor(card.attributes.nama);

                    return (
                        <Card
                            key={card.id}
                            className={`relative overflow-hidden bg-linear-to-br ${colorClass} border-0`}
                        >
                            <div className="absolute -top-4 -right-4 opacity-10">
                                <IconComponent className="h-32 w-32" />
                            </div>
                            <CardHeader className="pb-2 relative z-10">
                                <CardTitle className={`text-sm font-medium flex items-center gap-2 ${textColor}-800`}>
                                    <IconComponent className="h-4 w-4" />
                                    {card.attributes.nama}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className={`text-3xl font-bold mb-2 ${textColor}-900`}>
                                    {card.attributes.jumlah.toLocaleString("id-ID")}
                                </div>
                                <p className={`text-xs ${textColor}-600`}>
                                    {card.attributes.perempuan} perempuan, {card.attributes.laki} laki-laki
                                </p>
                                {card.attributes.persen && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                        {card.attributes.persen}
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {jumlahData && (
                    <Card className="bg-gradient-to-br from-emerald-100 to-emerald-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-800">
                                <Shield className="h-5 w-5" />
                                JUMLAH
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-900 mb-2">
                                {jumlahData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-sm text-emerald-600">
                                {jumlahData.attributes.perempuan} perempuan, {jumlahData.attributes.laki} laki-laki
                            </p>
                            {jumlahData.attributes.persen && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                    {jumlahData.attributes.persen}
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                )}

                {belumMengisiData && (
                    <Card className="bg-gradient-to-br from-gray-100 to-gray-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                <Users className="h-5 w-5" />
                                BELUM MENGISI
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {belumMengisiData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-sm text-gray-600">
                                {belumMengisiData.attributes.perempuan} perempuan, {belumMengisiData.attributes.laki}{" "}
                                laki-laki
                            </p>
                            {belumMengisiData.attributes.persen && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                    {belumMengisiData.attributes.persen}
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                )}

                {totalData && (
                    <Card className="bg-gradient-to-br from-purple-100 to-purple-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-800">
                                <TrendingUp className="h-5 w-5" />
                                TOTAL
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-900 mb-2">
                                {totalData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-sm text-purple-600">
                                {totalData.attributes.perempuan} perempuan, {totalData.attributes.laki} laki-laki
                            </p>
                            {totalData.attributes.persen && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                    {totalData.attributes.persen}
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {totalData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Rincian Total Kepesertaan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Total Peserta</span>
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-primary">
                                    {totalData.attributes.jumlah.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Perempuan</span>
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-primary">
                                    {totalData.attributes.perempuan.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Laki-laki</span>
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-primary">
                                    {totalData.attributes.laki.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Detail Kategori Pekerja BPJS Ketenagakerjaan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.data.map((item) => {
                            const IconComponent = getBPJSIcon(item.attributes.nama);
                            return (
                                <div
                                    key={item.id}
                                    className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                                >
                                    <div>
                                        <h4 className="font-semibold text-primary flex items-center gap-2">
                                            <IconComponent className="h-4 w-4" />
                                            {item.attributes.nama}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {item.attributes.perempuan} perempuan, {item.attributes.laki} laki-laki
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            {item.attributes.jumlah.toLocaleString("id-ID")}
                                        </div>
                                        {item.attributes.persen && (
                                            <Badge variant="secondary" className="text-xs">
                                                {item.attributes.persen}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

