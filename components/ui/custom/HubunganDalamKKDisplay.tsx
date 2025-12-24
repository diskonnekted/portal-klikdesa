"use client";

import * as React from "react";
import { BarChart3, Users, UserCheck, UsersRound, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HubunganDalamKKData {
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

interface HubunganDalamKKDisplayProps {
    className?: string;
}

const fetchHubunganDalamKKData = async (): Promise<HubunganDalamKKData | null> => {
    try {
        const response = await fetch(`/api/statistik/hubungan-dalam-kk`);
        if (!response.ok) throw new Error(`Failed to fetch hubungan-dalam-kk data: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch hubungan-dalam-kk data:", error);
        return null;
    }
};

export function HubunganDalamKKDisplay({ className }: HubunganDalamKKDisplayProps) {
    const [data, setData] = React.useState<HubunganDalamKKData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);
            try {
                const result = await Promise.race([
                    fetchHubunganDalamKKData(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000)),
                ]);
                setData(result as HubunganDalamKKData);
            } catch (error) {
                console.error("Failed to load hubungan-dalam-kk data:", error);
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
                            Data Hubungan Dalam KK
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
                            Data Hubungan Dalam KK
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <div className="text-center">
                                <p className="text-lg font-semibold mb-2">Data tidak tersedia</p>
                                <p className="text-sm">Tidak dapat memuat data hubungan dalam KK saat ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Define the specific relationships we want to display
    const mainRelationships = ["KEPALA KELUARGA", "SUAMI", "ISTRI", "ANAK"];

    const totalData = data.data.find((item) => item.attributes.nama === "TOTAL");

    // Create display cards for the 5 specific categories
    const displayCards = [];

    // Add the 4 main relationship cards
    for (const relationshipName of mainRelationships) {
        const item = data.data.find((item) => item.attributes.nama === relationshipName);
        if (item) {
            displayCards.push(item);
        } else {
            // If not found, create empty card
            displayCards.push({
                id: `empty-${relationshipName}`,
                type: "empty",
                attributes: { nama: relationshipName, jumlah: 0, laki: 0, perempuan: 0, persen: "0%" },
            });
        }
    }

    // Calculate LAINNYA (everything except the main 4 and TOTAL/JUMLAH/BELUM MENGISI)
    const othersData = data.data
        .filter(
            (item) =>
                !["JUMLAH", "BELUM MENGISI", "TOTAL", ...mainRelationships].includes(item.attributes.nama) &&
                item.attributes.jumlah > 0
        )
        .reduce(
            (acc, item) => {
                acc.jumlah += item.attributes.jumlah;
                acc.laki += item.attributes.laki;
                acc.perempuan += item.attributes.perempuan;
                return acc;
            },
            { jumlah: 0, laki: 0, perempuan: 0 }
        );

    // Add LAINNYA card
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

    const getHubunganColor = (nama: string, type?: string) => {
        if (type === "others" || nama === "LAINNYA") return "from-slate-100 to-slate-200";
        if (type === "info") return "from-cyan-100 to-cyan-200";
        if (type === "empty") return "from-gray-100 to-gray-200";

        // Specific colors for each relationship type
        switch (nama) {
            case "KEPALA KELUARGA":
                return "from-purple-100 to-purple-200";
            case "SUAMI":
                return "from-blue-100 to-blue-200";
            case "ISTRI":
                return "from-pink-100 to-pink-200";
            case "ANAK":
                return "from-green-100 to-green-200";
            default:
                return "from-gray-100 to-gray-200";
        }
    };

    const getHubunganIcon = (nama: string, type?: string) => {
        if (type === "others" || nama === "LAINNYA") return Users;
        if (type === "info") return BarChart3;
        if (type === "empty") return BarChart3;

        // Specific icons for each relationship type
        switch (nama) {
            case "KEPALA KELUARGA":
                return UserCheck;
            case "SUAMI":
                return UsersRound;
            case "ISTRI":
                return UsersRound;
            case "ANAK":
                return Users;
            default:
                return UsersRound;
        }
    };

    const getTextColor = (nama: string, type?: string) => {
        if (type === "others" || nama === "LAINNYA") return "text-slate";
        if (type === "info") return "text-cyan";
        if (type === "empty") return "text-gray";

        // Specific text colors for each relationship type
        switch (nama) {
            case "KEPALA KELUARGA":
                return "text-purple";
            case "SUAMI":
                return "text-blue";
            case "ISTRI":
                return "text-pink";
            case "ANAK":
                return "text-green";
            default:
                return "text-gray";
        }
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Data Hubungan Dalam KK
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Data statistik hubungan dalam Kartu Keluarga (KK) Desa
                    </p>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {displayCards.map((card) => {
                    const IconComponent = getHubunganIcon(card.attributes.nama, card.type);
                    const colorClass = getHubunganColor(card.attributes.nama, card.type);
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
                                    <p className={`text-xs ${textColor}-700`}>hubungan lainnya</p>
                                ) : card.type === "info" ? (
                                    <>
                                        <p className={`text-xs ${textColor}-700`}>total penduduk</p>
                                        <p className={`text-xs ${textColor}-600 mt-1`}>seluruh hubungan dalam KK</p>
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
                                <p className="text-2xl font-bold text-foreground">
                                    {totalData.attributes.jumlah.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">Perempuan</span>
                                    <UserCheck className="h-5 w-5 text-primary" />
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
                        Detail Statistik Hubungan Dalam KK
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
                                const IconComponent = getHubunganIcon(item.attributes.nama);
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                                    >
                                        <div>
                                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                                <IconComponent className="h-4 w-4 text-primary" />
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

