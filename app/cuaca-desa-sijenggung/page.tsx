"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Calendar, Thermometer, Droplets, Wind, MapPin } from "lucide-react";

type Lokasi = {
    provinsi?: string;
    kotkab?: string;
    kecamatan?: string;
    desa?: string;
    lat?: number;
    lon?: number;
    timezone?: string;
    adm1?: string;
    adm2?: string;
    adm3?: string;
    adm4?: string;
};

type CuacaEntry = {
    local_datetime?: string;
    utc_datetime?: string;
    t?: number;
    hu?: number;
    weather_desc?: string;
    weather_desc_en?: string;
    ws?: number;
    wd?: string;
    tcc?: number;
    vs_text?: string;
    analysis_date?: string;
    image?: string;
};

function groupByDate(entries: CuacaEntry[]) {
    const map = new Map<string, CuacaEntry[]>();
    for (const e of entries) {
        const date = (e.local_datetime || e.utc_datetime || "").slice(0, 10);
        if (!date) continue;
        const arr = map.get(date) || [];
        arr.push(e);
        map.set(date, arr);
    }
    return Array.from(map.entries())
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([date, arr]) => ({ date, entries: arr.sort((x, y) => ((x.local_datetime || "") < (y.local_datetime || "") ? -1 : 1)) }));
}

export default function CuacaDesaSijenggungPage() {
    const ADM4 = "33.04.09.2014";
    const [lokasi, setLokasi] = React.useState<Lokasi | null>(null);
    const [analysisDate, setAnalysisDate] = React.useState<string | null>(null);
    const [groups, setGroups] = React.useState<Array<{ date: string; entries: CuacaEntry[] }>>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            setGroups([]);
            setLokasi(null);
            setAnalysisDate(null);
            const res = await fetch(`/api/bmkg-weather/adm4?adm4=${encodeURIComponent(ADM4)}`);
            if (!res.ok) throw new Error(`Gagal mengambil data (${res.status})`);
            const json = await res.json();
            const payload = json?.data;
            const loc: Lokasi | null =
                payload?.lokasi ??
                (Array.isArray(payload?.data) && payload.data[0]?.lokasi ? payload.data[0].lokasi : null);
            const cuacaRaw: unknown =
                Array.isArray(payload?.cuaca) && payload.cuaca.length ? payload.cuaca : Array.isArray(payload?.data) ? payload.data[0]?.cuaca : null;
            const entries: CuacaEntry[] = Array.isArray(cuacaRaw)
                ? cuacaRaw.flat().filter((x) => typeof x === "object" && x)
                : [];
            const groups = groupByDate(entries).slice(0, 3);
            setLokasi(loc);
            setGroups(groups);
            const ad =
                entries.find((e) => e.analysis_date)?.analysis_date ??
                (Array.isArray(payload?.data) ? payload.data[0]?.analysis_date : null);
            setAnalysisDate(ad ?? null);
        } catch {
            setError("Gagal memuat data prakiraan cuaca BMKG");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Cuaca Desa Sijenggung (BMKG)</h1>
                <p className="text-gray-600">Prakiraan 3 hari, interval 3 jam per entri.</p>
                <div className="mt-2 text-xs text-gray-500">Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</div>
            </div>

            <Card className="bg-card border-border">
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                        <MapPin className="h-5 w-5 text-primary" />
                        Kode Wilayah ADM4 (Tetap)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm">
                        Desa Sijenggung menggunakan kode ADM4: <Badge variant="outline">{ADM4}</Badge>
                    </div>
                </CardContent>
            </Card>

            {loading && <div className="text-sm text-muted-foreground">Memuat data...</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="bg-card border-border">
                            <CardHeader className="gap-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                    <Cloud className="h-5 w-5 text-primary" />
                                    Prakiraan 3 Hari (3 Jam sekali)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {groups.length === 0 && (
                                    <div className="text-sm text-muted-foreground">Tidak ada data prakiraan tersedia.</div>
                                )}
                                {groups.length > 0 && (
                                    <div className="space-y-6">
                                        {groups.map((g) => (
                                            <div key={g.date} className="space-y-3">
                                                <div className="text-sm font-semibold">{g.date}</div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {g.entries.map((e, i) => {
                                                        const time = e.local_datetime || e.utc_datetime || "";
                                                        const icon =
                                                            e.image && typeof e.image === "string"
                                                                ? e.image.replace(/\s/g, "%20")
                                                                : "";
                                                        return (
                                                            <div
                                                                key={`${g.date}-${time}-${i}`}
                                                                className="p-3 border rounded-md bg-white/80 backdrop-blur-sm"
                                                            >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="text-sm font-medium">{e.weather_desc || "-"}</div>
                                                                        {icon ? (
                                                                        <Image
                                                                            src={icon}
                                                                            alt={e.weather_desc || "Ikon Cuaca"}
                                                                            title={e.weather_desc || "Ikon Cuaca"}
                                                                            width={24}
                                                                            height={24}
                                                                            className="w-6 h-6"
                                                                        />
                                                                    ) : (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            Cuaca
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    <Calendar className="inline h-3 w-3 mr-1" />
                                                                    {time}
                                                                </div>
                                                                <div className="mt-1 text-xs flex items-center gap-3">
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <Thermometer className="h-3 w-3" />
                                                                        {typeof e.t === "number" ? `${e.t}°C` : "-"}
                                                                    </span>
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <Droplets className="h-3 w-3" />
                                                                        {typeof e.hu === "number" ? `${e.hu}%` : "-"}
                                                                    </span>
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <Wind className="h-3 w-3" />
                                                                        {typeof e.ws === "number" ? `${e.ws} km/j` : "-"} {e.wd || ""}
                                                                    </span>
                                                                </div>
                                                                {e.vs_text && <div className="text-xs text-muted-foreground">Jarak pandang {e.vs_text}</div>}
                                                                {typeof e.tcc === "number" && (
                                                                    <div className="text-xs text-muted-foreground">Tutupan awan {e.tcc}%</div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
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
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">Detail Lokasi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!lokasi && <div className="text-sm text-muted-foreground">Lokasi tidak tersedia.</div>}
                                {lokasi && (
                                    <div className="space-y-1 text-sm">
                                        <div>Desa/Kelurahan: {lokasi.desa || "-"}</div>
                                        <div>Kecamatan: {lokasi.kecamatan || "-"}</div>
                                        <div>Kota/Kabupaten: {lokasi.kotkab || "-"}</div>
                                        <div>Provinsi: {lokasi.provinsi || "-"}</div>
                                        <div>
                                            Koordinat: {typeof lokasi.lat === "number" ? lokasi.lat.toFixed(4) : "-"},{" "}
                                            {typeof lokasi.lon === "number" ? lokasi.lon.toFixed(4) : "-"}
                                        </div>
                                        <div>Zona Waktu: {lokasi.timezone || "-"}</div>
                                        <div className="text-xs text-muted-foreground">
                                            ADM4: {lokasi.adm4 || ADM4} • ADM3: {lokasi.adm3 || "-"}
                                        </div>
                                        {analysisDate && (
                                            <div className="text-xs text-muted-foreground">Waktu produksi: {analysisDate}</div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}

            <div className="text-xs text-muted-foreground">
                Format data: JSON. Prakiraan 3 hari, 8 entri per hari. Pemutakhiran: 2 kali sehari. Batas akses: 60 permintaan per menit per IP.
                Wajib mencantumkan BMKG sebagai sumber data pada aplikasi.
            </div>
        </div>
    );
}
