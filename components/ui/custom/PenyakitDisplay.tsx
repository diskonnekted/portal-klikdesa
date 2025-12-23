"use client";

import * as React from "react";
import { Heart, Users, UserCheck, Activity, TrendingUp, BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EnfermededadData {
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

interface EnfermededadDisplayProps {
    className?: string;
}

const fetchPenyakitData = async (): Promise<EnfermededadData | null> => {
    try {
        const response = await fetch(`/api/statistik/penyakit`);
        if (!response.ok) throw new Error(`Failed to fetch penyakit data: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch penyakit data:", error);
        return null;
    }
};

export function DiseaseDisplay({ className }: EnfermededadDisplayProps) {
    const [data, setData] = React.useState<EnfermededadData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout: API took too long")), 30000);
            });
            try {
                const result = await Promise.race([fetchPenyakitData(), timeoutPromise]);
                setData(result as EnfermededadData);
            } catch (error) {
                console.error("Failed to load penyakit data:", error);
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
                            <Heart className="h-5 w-5 text-primary" />
                            Data Sakit/Penyakit Desa
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
                            <Heart className="h-5 w-5 text-primary" />
                            Data Sakit/Penyakit Desa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data sakit/penyakit saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const penyakitItems = data.data
        .filter(
            (item) => !["JUMLAH", "BELUM MENGISI", "TOTAL"].includes(item.attributes.nama) && item.attributes.jumlah > 0
        )
        .sort((a, b) => b.attributes.jumlah - a.attributes.jumlah);

    const top3Penyakit = penyakitItems.slice(0, 3);
    const otherPenyakit = penyakitItems.slice(3);

    const othersData = otherPenyakit.reduce(
        (acc, item) => {
            acc.jumlah += item.attributes.jumlah;
            acc.laki += item.attributes.laki;
            acc.perempuan += item.attributes.perempuan;
            return acc;
        },
        { jumlah: 0, laki: 0, perempuan: 0 }
    );

    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");
    const displayCards = [...top3Penyakit];

    if (otherPenyakit.length > 0) {
        displayCards.push({
            id: "others",
            type: "others",
            attributes: {
                nama: "LAINNYA",
                jumlah: othersData.jumlah,
                laki: othersData.laki,
                perempuan: othersData.perempuan,
                persen:
                    othersData.jumlah > 0
                        ? `${((othersData.jumlah / (totalData?.attributes.jumlah || 1)) * 100).toFixed(1)}%`
                        : "0%",
            },
        });
    } else if (penyakitItems.length < 3) {
        const remainingSlots = 3 - penyakitItems.length;
        for (let i = 0; i < remainingSlots; i++) {
            displayCards.push({
                id: `empty-${i}`,
                type: "empty",
                attributes: { nama: "-", jumlah: 0, laki: 0, perempuan: 0, persen: "0%" },
            });
        }
    } else if (penyakitItems.length === 3) {
        displayCards.push({
            id: "info",
            type: "info",
            attributes: {
                nama: "INFORMASI",
                jumlah: totalData?.attributes.jumlah || 0,
                laki: 0,
                perempuan: 0,
                persen: "100%",
            },
        });
    }

    const getPenyakitColor = (nama: string, type?: string) => {
        if (type === "others") return "from-slate-100 to-slate-200";
        if (type === "info") return "from-cyan-100 to-cyan-200";
        if (type === "empty") return "from-gray-100 to-gray-200";
        return "from-red-100 to-red-200";
    };

    const getPenyakitIcon = (nama: string, type?: string) => {
        if (type === "others") return Users;
        if (type === "info") return BarChart3;
        if (type === "empty") return Heart;
        return Activity;
    };

    const getTextColor = (nama: string, type?: string) => {
        if (type === "others") return "text-slate";
        if (type === "info") return "text-cyan";
        if (type === "empty") return "text-gray";
        return "text-red";
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Data Sakit/Penyakit Desa
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Data statistik sakit/penyakit penduduk Desa</p>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayCards.map((card) => {
                    const IconComponent = getPenyakitIcon(card.attributes.nama, card.type);
                    const colorClass = getPenyakitColor(card.attributes.nama, card.type);
                    const textColor = getTextColor(card.attributes.nama, card.type);

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
                                {card.type === "others" ? (
                                    <p className={`text-xs ${textColor}-700`}>penyakit lainnya</p>
                                ) : card.type === "info" ? (
                                    <>
                                        <p className={`text-xs ${textColor}-700`}>total penduduk</p>
                                        <p className={`text-xs ${textColor}-600 mt-1`}>seluruh penyakit</p>
                                    </>
                                ) : card.type === "empty" ? (
                                    <p className={`text-xs ${textColor}-600`}>tidak ada data</p>
                                ) : (
                                    <p className={`text-xs ${textColor}-600 mt-1`}>{card.attributes.persen}</p>
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
                            <BarChart3 className="h-5 w-5 text-primary" />
                            TOTAL
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Total Population</span>
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-2xl font-bold text-primary">
                                    {totalData.attributes.jumlah.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Perempuan</span>
                                    <UserCheck className="h-5 w-5 text-primary" />
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
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Detail Statistik Sakit/Penyakit
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.data
                            .filter(
                                (item) =>
                                    !["JUMLAH", "BELUM MENGISI", "TOTAL"].includes(item.attributes.nama) &&
                                    item.attributes.jumlah > 0
                            )
                            .map((item) => {
                                const IconComponent = getPenyakitIcon(item.attributes.nama);
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

