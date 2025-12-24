"use client";

import * as React from "react";
import { BarChart3, Heart, TrendingUp, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PenerimaBantuanPendudukData {
    data: Array<{
        type: string;
        id: string;
        attributes: {
            nama: string;
            slug?: string;
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

interface PenerimaBantuanPendudukDisplayProps {
    className?: string;
}

const fetchPenerimaBantuanPendudukData = async (): Promise<PenerimaBantuanPendudukData | null> => {
    try {
        const response = await fetch(`/api/statistik/penerima-bantuan-penduduk`);
        if (!response.ok) throw new Error(`Failed to fetch penerima-bantuan-penduduk data: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch penerima-bantuan-penduduk data:", error);
        return null;
    }
};

export function PenerimaBantuanPendudukDisplay({ className }: PenerimaBantuanPendudukDisplayProps) {
    const [data, setData] = React.useState<PenerimaBantuanPendudukData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);
            try {
                const result = await Promise.race([
                    fetchPenerimaBantuanPendudukData(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000)),
                ]);
                setData(result as PenerimaBantuanPendudukData);
            } catch (error) {
                console.error("Failed to load penerima-bantuan-penduduk data:", error);
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
                            Data Penerima Bantuan Penduduk
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
                            Data Penerima Bantuan Penduduk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data penerima bantuan penduduk saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");

    const getBantuanColor = (nama: string) => {
        switch (nama) {
            case "PENERIMA":
                return "from-green-100 to-green-200";
            case "BUKAN PENERIMA":
                return "from-gray-100 to-gray-200";
            case "TOTAL":
                return "from-blue-100 to-blue-200";
            default:
                return "from-purple-100 to-purple-200";
        }
    };

    const getBantuanIcon = (nama: string) => {
        switch (nama) {
            case "PENERIMA":
                return Heart;
            case "BUKAN PENERIMA":
                return Users;
            case "TOTAL":
                return TrendingUp;
            default:
                return DollarSign;
        }
    };

    const getTextColor = (nama: string) => {
        switch (nama) {
            case "PENERIMA":
                return "text-green";
            case "BUKAN PENERIMA":
                return "text-gray";
            case "TOTAL":
                return "text-blue";
            default:
                return "text-purple";
        }
    };

    const displayData = data.data.filter((item) => !["JUMLAH", "BELUM MENGISI"].includes(item.attributes.nama));

    return (
        <div className={cn("w-full space-y-6", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Data Penerima Bantuan Penduduk
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Data statistik penerima bantuan penduduk Desa</p>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayData.map((card) => {
                    const IconComponent = getBantuanIcon(card.attributes.nama);
                    const colorClass = getBantuanColor(card.attributes.nama);
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

            {totalData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Rincian Total Penduduk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Total Penduduk</span>
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {totalData.attributes.jumlah.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Perempuan</span>
                                    <Heart className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {totalData.attributes.perempuan.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Laki-laki</span>
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">
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
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Detail Statistik Penerima Bantuan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.data
                            .filter((item) => !["JUMLAH", "BELUM MENGISI"].includes(item.attributes.nama))
                            .map((item) => {
                                const IconComponent = getBantuanIcon(item.attributes.nama);
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                                <IconComponent className="h-4 w-4" />
                                                {item.attributes.nama}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {item.attributes.perempuan} perempuan, {item.attributes.laki} laki-laki
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-foreground">
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

