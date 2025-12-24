"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Earth, Calendar, MapPin, Waves, AlertTriangle } from "lucide-react";

type AutoGempa = {
    Tanggal: string;
    Jam: string;
    DateTime: string;
    Coordinates: string;
    Lintang: string;
    Bujur: string;
    Magnitude: string;
    Kedalaman: string;
    Wilayah: string;
    Potensi: string;
    Dirasakan: string;
    Shakemap: string;
};

type ListGempa = {
    Tanggal: string;
    Jam: string;
    DateTime: string;
    Coordinates: string;
    Lintang: string;
    Bujur: string;
    Magnitude: string;
    Kedalaman: string;
    Wilayah: string;
    Potensi?: string;
    Dirasakan?: string;
};

const JAVA_TERMS = ["jawa barat", "jawa tengah", "jawa timur", "daerah istimewa yogyakarta", "di yogyakarta", "dki jakarta", "banten"];

function isJavaRegion(text: string) {
    const t = text.toLowerCase();
    return JAVA_TERMS.some((k) => t.includes(k));
}

export default function GempaTerkiniPage() {
    const [autoGempa, setAutoGempa] = React.useState<AutoGempa | null>(null);
    const [listM5, setListM5] = React.useState<ListGempa[]>([]);
    const [listDirasakan, setListDirasakan] = React.useState<ListGempa[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const [autoRes, m5Res, feltRes] = await Promise.all([
                    fetch("/api/bmkg-quake/autogempa"),
                    fetch("/api/bmkg-quake/gempaterkini"),
                    fetch("/api/bmkg-quake/gempadirasakan"),
                ]);
                const autoJson = await autoRes.json();
                const m5Json = await m5Res.json();
                const feltJson = await feltRes.json();
                const autoItem: AutoGempa | null =
                    autoJson?.success && autoJson?.data?.Infogempa?.gempa ? autoJson.data.Infogempa.gempa : null;
                const m5Items: ListGempa[] = m5Json?.success && m5Json?.data?.Infogempa?.gempa ? m5Json.data.Infogempa.gempa : [];
                const feltItems: ListGempa[] =
                    feltJson?.success && feltJson?.data?.Infogempa?.gempa ? feltJson.data.Infogempa.gempa : [];

                setAutoGempa(autoItem && isJavaRegion(autoItem.Wilayah) ? autoItem : null);
                setListM5(m5Items.filter((g) => isJavaRegion(g.Wilayah)).slice(0, 10));
                setListDirasakan(feltItems.filter((g) => isJavaRegion(g.Wilayah)).slice(0, 10));
            } catch {
                setError("Gagal memuat data gempabumi BMKG");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const shakemapUrl =
        autoGempa?.Shakemap ? `https://static.bmkg.go.id/${autoGempa.Shakemap.replace(/^\//, "")}` : null;

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Data Gempa Terkini (Pulau Jawa)</h1>
                <p className="text-gray-600">
                    Tiga jenis data: Gempabumi M 5.0+, Gempabumi Dirasakan, dan Gempabumi Berpotensi Tsunami.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                    Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
                </div>
            </div>

            {loading && <div className="text-sm text-muted-foreground">Memuat data...</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="bg-card border-border">
                            <CardHeader className="gap-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                    <Earth className="h-5 w-5 text-primary" />
                                    Gempabumi Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!autoGempa && (
                                    <div className="text-sm text-muted-foreground">
                                        Tidak ada gempabumi terbaru di wilayah Pulau Jawa.
                                    </div>
                                )}
                                {autoGempa && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm font-semibold">{autoGempa.Wilayah}</div>
                                            <div className="text-xs text-muted-foreground">
                                                <Calendar className="inline h-3 w-3 mr-1" />
                                                {autoGempa.Tanggal} • {autoGempa.Jam}
                                            </div>
                                            <div className="mt-2 text-sm">
                                                Magnitudo {autoGempa.Magnitude} • Kedalaman {autoGempa.Kedalaman}
                                            </div>
                                            <div className="text-xs">
                                                Lintang {autoGempa.Lintang} • Bujur {autoGempa.Bujur}
                                            </div>
                                            <div className="mt-2 text-xs">
                                                <Badge variant="outline" className="mr-2">
                                                    {autoGempa.Potensi}
                                                </Badge>
                                                {autoGempa.Dirasakan && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        {autoGempa.Dirasakan}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded-md overflow-hidden border bg-muted">
                                            {shakemapUrl ? (
                                                <Image
                                                    src={shakemapUrl}
                                                    alt="Shakemap BMKG"
                                                    width={1024}
                                                    height={512}
                                                    className="w-full h-64 object-contain bg-white"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-64 flex items-center justify-center text-sm text-muted-foreground">
                                                    Shakemap tidak tersedia
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader className="gap-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                    <Waves className="h-5 w-5 text-primary" />
                                    Daftar 15 Gempabumi M 5.0+ (Pulau Jawa)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {listM5.length === 0 && (
                                    <div className="text-sm text-muted-foreground">Tidak ada data M 5.0+ untuk Pulau Jawa.</div>
                                )}
                                {listM5.length > 0 && (
                                    <div className="space-y-3">
                                        {listM5.map((g, i) => (
                                            <div key={`${g.DateTime}-${i}`} className="flex items-start gap-2 pb-3 border-b last:border-0">
                                                <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">{g.Wilayah}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Magnitudo {g.Magnitude} • Kedalaman {g.Kedalaman}
                                                    </div>
                                                    <div className="text-xs">
                                                        <Calendar className="inline h-3 w-3 mr-1" />
                                                        {g.Tanggal} • {g.Jam}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        <MapPin className="inline h-3 w-3 mr-1" />
                                                        {g.Lintang} • {g.Bujur}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-4">
                        <Card className="bg-card border-border">
                            <CardHeader className="gap-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                    <AlertTriangle className="h-5 w-5 text-primary" />
                                    Gempabumi Dirasakan (Pulau Jawa)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {listDirasakan.length === 0 && (
                                    <div className="text-sm text-muted-foreground">Tidak ada data dirasakan untuk Pulau Jawa.</div>
                                )}
                                {listDirasakan.length > 0 && (
                                    <div className="space-y-3">
                                        {listDirasakan.map((g, i) => (
                                            <div key={`${g.DateTime}-${i}`} className="p-3 border rounded-md bg-white/80 backdrop-blur-sm">
                                                <div className="text-sm font-medium">{g.Wilayah}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Magnitudo {g.Magnitude} • Kedalaman {g.Kedalaman}
                                                </div>
                                                <div className="text-xs">
                                                    <Calendar className="inline h-3 w-3 mr-1" />
                                                    {g.Tanggal} • {g.Jam}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    <MapPin className="inline h-3 w-3 mr-1" />
                                                    {g.Lintang} • {g.Bujur}
                                                </div>
                                                {g.Dirasakan && <div className="text-xs mt-1">{g.Dirasakan}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            <div className="text-xs text-muted-foreground">
                Format data: XML, JSON, dan JPG. Pemutakhiran: setiap ada peristiwa gempa. Batas akses: 60 permintaan per menit per IP. Wajib
                mencantumkan BMKG sebagai sumber data pada aplikasi.
                <span className="ml-2">
                    <Link href="https://data.bmkg.go.id/gempabumi/" target="_blank" className="text-primary">
                        data.bmkg.go.id/gempabumi
                    </Link>
                </span>
            </div>
        </div>
    );
}
