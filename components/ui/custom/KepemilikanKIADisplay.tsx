"use client";

import * as React from "react";
import { BarChart3, CreditCard, TrendingUp, Users, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KepemilikanKIAData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            nama: string;
            ktp_el?: number;
            status_rekam?: number;
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

interface KepemilikanKIADisplayProps {
    className?: string;
}

const fetchKepemilikanKIAData = async (): Promise<KepemilikanKIAData | null> => {
    try {
        const response = await fetch(`/api/statistik/kepemilikan-kia`);
        if (!response.ok) throw new Error(`Failed to fetch kepemilikan-kia data: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch kepemilikan-kia data:", error);
        return null;
    }
};

export function KepemilikanKIADisplay({ className }: KepemilikanKIADisplayProps) {
    const [data, setData] = React.useState<KepemilikanKIAData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);
            try {
                const result = await Promise.race([
                    fetchKepemilikanKIAData(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000)),
                ]);
                setData(result as KepemilikanKIAData);
            } catch (error) {
                console.error("Failed to load kepemilikan-kia data:", error);
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
                            Data Kepemilikan KIA
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
                            Data Kepemilikan KIA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data KIA saat ini</p>
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

    const getKIAColor = (nama: string) => {
        switch (nama) {
            case "BELUM REKAM":
                return "from-red-100 to-red-200";
            case "SUDAH REKAM":
                return "from-green-100 to-green-200";
            case "CARD PRINTED":
                return "from-blue-100 to-blue-200";
            case "PRINT READY RECORD":
                return "from-purple-100 to-purple-200";
            case "CARD SHIPPED":
                return "from-orange-100 to-orange-200";
            case "SENT FOR CARD PRINTING":
                return "from-cyan-100 to-cyan-200";
            case "CARD ISSUED":
                return "from-emerald-100 to-emerald-200";
            case "BELUM WAJIB":
                return "from-gray-100 to-gray-200";
            case "TOTAL":
                return "from-indigo-100 to-indigo-200";
            case "JUMLAH":
                return "from-pink-100 to-pink-200";
            case "BELUM MENGISI":
                return "from-yellow-100 to-yellow-200";
            default:
                return "from-slate-100 to-slate-200";
        }
    };

    const getKIAIcon = (nama: string) => {
        switch (nama) {
            case "BELUM REKAM":
                return FileCheck;
            case "SUDAH REKAM":
                return CreditCard;
            case "CARD PRINTED":
                return CreditCard;
            case "PRINT READY RECORD":
                return FileCheck;
            case "CARD SHIPPED":
                return CreditCard;
            case "SENT FOR CARD PRINTING":
                return FileCheck;
            case "CARD ISSUED":
                return CreditCard;
            case "BELUM WAJIB":
                return Users;
            case "TOTAL":
                return TrendingUp;
            case "JUMLAH":
                return CreditCard;
            case "BELUM MENGISI":
                return Users;
            default:
                return FileCheck;
        }
    };

    const getTextColor = (nama: string) => {
        switch (nama) {
            case "BELUM REKAM":
                return "text-red";
            case "SUDAH REKAM":
                return "text-green";
            case "CARD PRINTED":
                return "text-blue";
            case "PRINT READY RECORD":
                return "text-purple";
            case "CARD SHIPPED":
                return "text-orange";
            case "SENT FOR CARD PRINTING":
                return "text-cyan";
            case "CARD ISSUED":
                return "text-emerald";
            case "BELUM WAJIB":
                return "text-gray";
            case "TOTAL":
                return "text-indigo";
            case "JUMLAH":
                return "text-pink";
            case "BELUM MENGISI":
                return "text-yellow";
            default:
                return "text-slate";
        }
    };

    // Get KIA status data (excluding TOTAL, JUMLAH, BELUM MENGISI)
    const kiaStatusData = data.data.filter(
        (item) => !["TOTAL", "JUMLAH", "BELUM MENGISI"].includes(item.attributes.nama)
    );

    return (
        <div className={cn("w-full space-y-6", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Data Kepemilikan KIA
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Data statistik kepemilikan Kartu Identitas Anak (KIA) Desa
                    </p>
                </CardHeader>
            </Card>

            {/* KIA status cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {kiaStatusData.map((card) => {
                    const IconComponent = getKIAIcon(card.attributes.nama);
                    const colorClass = getKIAColor(card.attributes.nama);
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
                    <Card className="bg-gradient-to-br from-pink-100 to-pink-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-pink-800">
                                <CreditCard className="h-5 w-5" />
                                JUMLAH
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-pink-900 mb-2">
                                {jumlahData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-sm text-pink-600">
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
                    <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-800">
                                <Users className="h-5 w-5" />
                                BELUM MENGISI
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-900 mb-2">
                                {belumMengisiData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-sm text-yellow-600">
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
                    <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-indigo-800">
                                <TrendingUp className="h-5 w-5" />
                                TOTAL
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-indigo-900 mb-2">
                                {totalData.attributes.jumlah.toLocaleString("id-ID")}
                            </div>
                            <p className="text-sm text-indigo-600">
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
                            Rincian Total Data KIA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Total Data</span>
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-primary">
                                    {totalData.attributes.jumlah.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Perempuan</span>
                                    <CreditCard className="h-5 w-5 text-primary" />
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
                        <CreditCard className="h-5 w-5 text-primary" />
                        Detail Status KIA
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.data.map((item) => {
                            const IconComponent = getKIAIcon(item.attributes.nama);
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
                                        {item.attributes.status_rekam !== undefined && (
                                            <p className="text-xs text-muted-foreground">
                                                Status: {item.attributes.status_rekam}
                                            </p>
                                        )}
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

