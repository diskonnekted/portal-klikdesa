"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface IDMRow {
    NO: number | null;
    INDIKATOR: string;
    SKOR: number | string;
    KETERANGAN: string | null;
    KEGIATAN: string | null;
    NILAI: string | null;
    PUSAT: string | null;
    PROV: string | null;
    KAB: string | null;
    DESA: string | null;
    CSR: string | null;
    LAINNYA: string | null;
    ROW_CELL: number;
}

interface IDMSummary {
    SUMMARIES: {
        SKOR_SAAT_INI: number;
        STATUS: string;
        TARGET_STATUS: string;
        SKOR_MINIMAL: number;
        PENAMBAHAN: number;
        TAHUN: number;
    };
    ROW: IDMRow[];
    IDENTITAS: Array<{
        nama_provinsi: string;
        id_prov: string;
        id_kabupaten: string;
        nama_kab_kota: string;
        id_kecamatan: string;
        nama_kecamatan: string;
        id_desa: string;
        nama_desa: string;
    }>;
}

interface IDMDetailTableProps {
    data: IDMSummary;
    className?: string;
}

export function IDMDetailTable({ data, className }: IDMDetailTableProps) {
    // Filter to show only actual indicators (not the summary rows)
    const indicators = data.ROW.filter((row) => row.NO !== null && row.INDIKATOR !== "STATUS IDM 2024");

    // Group indicators by category
    const iksIndicators = indicators.filter((_, index) => index < 35);
    const ikeIndicators = indicators.filter((_, index) => index >= 35 && index < 47);
    const iklIndicators = indicators.filter((_, index) => index >= 47);

    const getScoreBadgeVariant = (score: number | string) => {
        const numScore = typeof score === "string" ? parseFloat(score) : score;
        if (numScore >= 5) return "default";
        if (numScore >= 4) return "secondary";
        if (numScore >= 3) return "outline";
        return "destructive";
    };

    const renderIndicatorTable = (title: string, color: string, indicators: IDMRow[]) => (
        <Card className="mb-8 pt-0 gap-0">
            <CardHeader className={cn("bg-linear-to-r", color, "text-white")}>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-primary/30 hover:bg-primary/30">
                                <TableHead
                                    className="w-[60px] font-bold text-xs text-center border border-primary/20"
                                    rowSpan={2}
                                >
                                    No.
                                </TableHead>
                                <TableHead
                                    className="min-w-[300px] font-bold text-xs text-center border border-primary/20"
                                    rowSpan={2}
                                >
                                    Indikator IDM
                                </TableHead>
                                <TableHead
                                    className="w-20 font-bold text-xs text-center border border-primary/20"
                                    rowSpan={2}
                                >
                                    Skor
                                </TableHead>
                                <TableHead
                                    className="min-w-[250px] font-bold text-xs text-center border border-primary/20"
                                    rowSpan={2}
                                >
                                    Keterangan
                                </TableHead>
                                <TableHead
                                    className="min-w-[300px] font-bold text-xs text-center border border-primary/20"
                                    rowSpan={2}
                                >
                                    Kegiatan yang Dapat Dilakukan
                                </TableHead>
                                <TableHead
                                    className="w-[100px] font-bold text-xs text-center border border-primary/20"
                                    rowSpan={2}
                                >
                                    Nilai
                                </TableHead>
                                <TableHead
                                    className="min-w-[600px] text-xs text-center font-bold border border-primary/20"
                                    colSpan={6}
                                >
                                    Yang Dapat Melaksanakan Kegiatan
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-primary/20 hover:bg-primary/20">
                                <TableHead className="w-[100px] text-xs font-semibold text-center border border-primary/20">
                                    Pusat
                                </TableHead>
                                <TableHead className="w-[100px] text-xs font-semibold text-center border border-primary/20">
                                    Provinsi
                                </TableHead>
                                <TableHead className="w-[100px] text-xs font-semibold text-center border border-primary/20">
                                    Kabupaten
                                </TableHead>
                                <TableHead className="w-[100px] text-xs font-semibold text-center border border-primary/20">
                                    Desa
                                </TableHead>
                                <TableHead className="w-[100px] text-xs font-semibold text-center border border-primary/20">
                                    CSR
                                </TableHead>
                                <TableHead className="w-[100px] text-xs font-semibold text-center border border-primary/20">
                                    Lainnya
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {indicators.map((item, index) => (
                                <TableRow
                                    key={item.ROW_CELL}
                                    className={cn("hover:bg-muted/50", index % 2 === 0 ? "bg-white" : "bg-primary/10")}
                                >
                                    <TableCell className="text-xs text-center border border-primary/20">
                                        {item.NO}
                                    </TableCell>
                                    <TableCell className="text-xs wrap-break-word border border-primary/20">
                                        {item.INDIKATOR.replace("Skor ", "")}
                                    </TableCell>
                                    <TableCell className="text-center border border-primary/20">
                                        <Badge variant={getScoreBadgeVariant(item.SKOR)}>{item.SKOR}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground wrap-break-word border border-primary/20">
                                        {item.KETERANGAN || "-"}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground wrap-break-word border border-primary/20">
                                        {item.KEGIATAN || "-"}
                                    </TableCell>
                                    <TableCell className="text-center text-xs font-mono border border-primary/20">
                                        +{item.NILAI || "-"}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground border border-primary/20">
                                        <div className="wrap-break-word">{item.PUSAT || "-"}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground border border-primary/20">
                                        <div className="wrap-break-word">{item.PROV || "-"}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground border border-primary/20">
                                        <div className="wrap-break-word">{item.KAB || "-"}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground border border-primary/20">
                                        <div className="wrap-break-word">{item.DESA || "-"}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground border border-primary/20">
                                        <div className="wrap-break-word">{item.CSR || "-"}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground border border-primary/20">
                                        <div className="wrap-break-word">{item.LAINNYA || "-"}</div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-2">Detail Indikator IDM</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Tabel lengkap semua indikator Indeks Desa Mandiri Tahun {data.SUMMARIES.TAHUN} -{" "}
                    {data.IDENTITAS[0]?.nama_desa}
                </p>
            </div>

            {/* Analytics Dashboard */}
            <div className="space-y-6">
                {/* Top & Bottom Performers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <TrendingUp className="h-5 w-5" />
                                Top 5 Indikator Terbaik
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {indicators
                                    .sort(
                                        (a, b) =>
                                            (typeof b.SKOR === "number" ? b.SKOR : parseFloat(b.SKOR as string) || 0) -
                                            (typeof a.SKOR === "number" ? a.SKOR : parseFloat(a.SKOR as string) || 0)
                                    )
                                    .slice(0, 5)
                                    .map((item, idx) => (
                                        <div key={item.ROW_CELL} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">
                                                    {item.INDIKATOR.replace("Skor ", "")}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={
                                                            (typeof item.SKOR === "number"
                                                                ? item.SKOR
                                                                : parseFloat(item.SKOR as string) || 0) * 20
                                                        }
                                                        className="h-2 flex-1"
                                                    />
                                                    <span className="text-sm font-bold text-green-600">
                                                        {typeof item.SKOR === "number"
                                                            ? item.SKOR
                                                            : parseFloat(item.SKOR as string) || 0}
                                                        /5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <TrendingDown className="h-5 w-5" />5 Indikator Perlu Perbaikan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {indicators
                                    .sort(
                                        (a, b) =>
                                            (typeof a.SKOR === "number" ? a.SKOR : parseFloat(a.SKOR as string) || 0) -
                                            (typeof b.SKOR === "number" ? b.SKOR : parseFloat(b.SKOR as string) || 0)
                                    )
                                    .slice(0, 5)
                                    .map((item, idx) => (
                                        <div key={item.ROW_CELL} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">
                                                    {item.INDIKATOR.replace("Skor ", "")}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={
                                                            (typeof item.SKOR === "number"
                                                                ? item.SKOR
                                                                : parseFloat(item.SKOR as string) || 0) * 20
                                                        }
                                                        className="h-2 flex-1"
                                                    />
                                                    <span className="text-sm font-bold text-red-600">
                                                        {typeof item.SKOR === "number"
                                                            ? item.SKOR
                                                            : parseFloat(item.SKOR as string) || 0}
                                                        /5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Institution Involvement */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Distribusi Tanggung Jawab Institution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={[
                                    {
                                        name: "PUSAT",
                                        count: indicators.filter((i) => i.PUSAT && i.PUSAT !== "-").length,
                                    },
                                    {
                                        name: "PROVINSI",
                                        count: indicators.filter((i) => i.PROV && i.PROV !== "-").length,
                                    },
                                    {
                                        name: "KABUPATEN",
                                        count: indicators.filter((i) => i.KAB && i.KAB !== "-").length,
                                    },
                                    { name: "DESA", count: indicators.filter((i) => i.DESA && i.DESA !== "-").length },
                                    { name: "CSR", count: indicators.filter((i) => i.CSR && i.CSR !== "-").length },
                                    {
                                        name: "LAINNYA",
                                        count: indicators.filter((i) => i.LAINNYA && i.LAINNYA !== "-").length,
                                    },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* IKS Section */}
            {renderIndicatorTable("Indeks Kelurahan Sehat (IKS)", "from-green-500 to-green-600", iksIndicators)}

            {/* IKE Section */}
            {renderIndicatorTable("Indeks Kelurahan Ekonomi (IKE)", "from-blue-500 to-blue-600", ikeIndicators)}

            {/* IKL Section */}
            {renderIndicatorTable("Indeks Kelurahan Lingkungan (IKL)", "from-yellow-500 to-yellow-600", iklIndicators)}
        </div>
    );
}
