"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Globe, Map, AlertTriangle, ChevronRight } from "lucide-react";

const LeafletMap = dynamic(() => import("@/components/ui/custom/LeafletMap").then((m) => m.LeafletMap), {
    ssr: false,
});

type RssItem = {
    title: string;
    link: string;
    description: string;
    author: string;
    pubDate: string;
};

function parseRss(xmlText: string): RssItem[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");
    const items = Array.from(doc.getElementsByTagName("item"));
    return items.map((item) => ({
        title: item.getElementsByTagName("title")[0]?.textContent ?? "",
        link: item.getElementsByTagName("link")[0]?.textContent ?? "",
        description: item.getElementsByTagName("description")[0]?.textContent ?? "",
        author: item.getElementsByTagName("author")[0]?.textContent ?? "",
        pubDate: item.getElementsByTagName("pubDate")[0]?.textContent ?? "",
    }));
}

function getElementsByLocalName(root: Element | Document, localName: string): Element[] {
    const result: Element[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode as Element | null;
    while (node) {
        if ((node as Element).localName === localName) {
            result.push(node as Element);
        }
        node = walker.nextNode() as Element | null;
    }
    return result;
}

function parseCap(xmlText: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");

    const info = getElementsByLocalName(doc, "info")[0];
    const getText = (name: string) => getElementsByLocalName(info ?? doc, name)[0]?.textContent ?? "";

    const event = getText("event");
    const effective = getText("effective");
    const expires = getText("expires");
    const senderName = getText("senderName");
    const headline = getText("headline");
    const description = getText("description");
    const web = getText("web");

    const polygonElems = getElementsByLocalName(info ?? doc, "polygon");
    const polygons = polygonElems.map((el) => (el.textContent ?? "").trim()).filter(Boolean);

    return { event, effective, expires, senderName, headline, description, web, polygons };
}

function polygonToGeoJSON(polygonStr: string) {
    const pairs = polygonStr.split(/\s+/).map((p) => p.trim()).filter(Boolean);
    const coords = pairs
        .map((p) => p.split(",").map((v) => parseFloat(v)))
        .filter((arr) => arr.length === 2 && arr.every((n) => Number.isFinite(n)));
    if (coords.length < 3) return null;
    const ring = coords.map(([lat, lon]) => [lon, lat]);
    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [ring],
        },
        properties: {},
    } as import("geojson").Feature;
}

function centerOfPolygon(polygonStr: string): [number, number] | null {
    const pairs = polygonStr.split(/\s+/).map((p) => p.trim()).filter(Boolean);
    const coords = pairs
        .map((p) => p.split(",").map((v) => parseFloat(v)))
        .filter((arr) => arr.length === 2 && arr.every((n) => Number.isFinite(n)));
    if (coords.length === 0) return null;
    const avgLat = coords.reduce((s, [lat]) => s + lat, 0) / coords.length;
    const avgLon = coords.reduce((s, [, lon]) => s + lon, 0) / coords.length;
    return [avgLat, avgLon];
}

export default function PeringatanDiniCuacaPage() {
    const [lang, setLang] = React.useState<"id" | "en">("id");
    const [rssItems, setRssItems] = React.useState<RssItem[]>([]);
    const [loadingRss, setLoadingRss] = React.useState(false);
    const [errorRss, setErrorRss] = React.useState<string | null>(null);

    const [selectedItem, setSelectedItem] = React.useState<RssItem | null>(null);
    const [capDetail, setCapDetail] = React.useState<ReturnType<typeof parseCap> | null>(null);
    const [loadingCap, setLoadingCap] = React.useState(false);
    const [errorCap, setErrorCap] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchRss = async () => {
            try {
                setLoadingRss(true);
                setErrorRss(null);
                const res = await fetch(`/api/bmkg-nowcast/rss?lang=${lang}`);
                if (!res.ok) throw new Error(`Gagal mengambil RSS (${res.status})`);
                const xmlText = await res.text();
                const items = parseRss(xmlText);
                const terms = lang === "id" ? ["jawa tengah", "jawa barat", "jawa timur"] : ["central java", "west java", "east java"];
                const filtered = items.filter((item) => {
                    const txt = `${item.title} ${item.description}`.toLowerCase();
                    return terms.some((t) => txt.includes(t));
                });
                setRssItems(filtered);
            } catch {
                setErrorRss("Gagal memuat RSS BMKG");
            } finally {
                setLoadingRss(false);
            }
        };
        fetchRss();
    }, [lang]);

    const openDetail = async (item: RssItem) => {
        setSelectedItem(item);
        setLoadingCap(true);
        setErrorCap(null);
        setCapDetail(null);
        try {
            const link = item.link;
            const match = link.match(/\/([A-Z0-9]+)_alert\.xml$/i);
            const code = match ? match[1] : "";
            if (!code) throw new Error("Kode CAP tidak ditemukan dari tautan");
            const res = await fetch(`/api/bmkg-nowcast/cap?lang=${lang}&code=${code}`);
            if (!res.ok) throw new Error(`Gagal mengambil CAP (${res.status})`);
            const xmlText = await res.text();
            const detail = parseCap(xmlText);
            setCapDetail(detail);
        } catch {
            setErrorCap("Gagal memuat detail CAP BMKG");
        } finally {
            setLoadingCap(false);
        }
    };

    const geoJson = React.useMemo(() => {
        if (!capDetail?.polygons?.length) return null;
        const features = capDetail.polygons
            .map(polygonToGeoJSON)
            .filter(Boolean) as import("geojson").Feature[];
        return {
            type: "FeatureCollection",
            features,
        } as import("geojson").FeatureCollection;
    }, [capDetail]);

    const mapCenter: [number, number] = React.useMemo(() => {
        const center = capDetail?.polygons?.length ? centerOfPolygon(capDetail.polygons[0]) : null;
        return center ?? [-7.379, 109.675]; // Banjarnegara fallback
    }, [capDetail]);

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground mb-2">Peringatan Dini Cuaca (BMKG)</h1>
                <p className="text-gray-600">
                    Data berbasis CAP (XML) — RSS daftar peringatan aktif per provinsi dan CAP detail wilayah terdampak.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                    Sumber data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
                </div>
            </div>

            <Card className="bg-card border-border">
                <CardHeader className="gap-0">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                        <Globe className="h-5 w-5 text-primary" />
                        Pilih Bahasa
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <button
                            className={`px-3 py-1 rounded ${lang === "id" ? "bg-primary text-white" : "bg-muted text-foreground"}`}
                            onClick={() => setLang("id")}
                        >
                            Indonesia
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${lang === "en" ? "bg-primary text-white" : "bg-muted text-foreground"}`}
                            onClick={() => setLang("en")}
                        >
                            English
                        </button>
                    </div>
                </CardContent>
            </Card>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Card className="bg-card border-border">
                        <CardHeader className="gap-0">
                            <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                <AlertTriangle className="h-5 w-5 text-primary" />
                                Daftar Peringatan Aktif (RSS)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingRss && <div className="text-sm text-muted-foreground">Memuat RSS...</div>}
                            {errorRss && <div className="text-sm text-red-600">{errorRss}</div>}
                            {!loadingRss && !errorRss && (
                                <div className="space-y-4">
                                    {rssItems.slice(0, 20).map((item) => (
                                        <div
                                            key={item.link}
                                            className="p-3 border rounded-md hover:shadow-sm bg-white/80 backdrop-blur-sm"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-medium text-sm leading-tight">{item.title}</h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {item.author || "BMKG"}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground my-1">
                                                <Calendar className="inline h-3 w-3 mr-1" />
                                                {item.pubDate}
                                            </div>
                                            <p className="text-xs text-foreground line-clamp-2">{item.description}</p>
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    className="px-2 py-1 text-xs bg-primary text-white rounded inline-flex items-center gap-1"
                                                    onClick={() => openDetail(item)}
                                                >
                                                    Lihat Detail
                                                    <ChevronRight className="h-3 w-3" />
                                                </button>
                                                <Link
                                                    href={item.link}
                                                    target="_blank"
                                                    className="px-2 py-1 text-xs bg-muted rounded"
                                                >
                                                    Buka CAP XML
                                                </Link>
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
                                <Map className="h-5 w-5 text-primary" />
                                Detail Wilayah Terdampak (CAP)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingCap && <div className="text-sm text-muted-foreground">Memuat detail CAP...</div>}
                            {errorCap && <div className="text-sm text-red-600">{errorCap}</div>}
                            {!loadingCap && !errorCap && capDetail && (
                                <div className="space-y-3">
                                    <div className="text-sm font-semibold">{capDetail.headline || selectedItem?.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {capDetail.event} • {capDetail.senderName}
                                    </div>
                                    <div className="text-xs">
                                        Mulai: {capDetail.effective || "-"} • Berakhir: {capDetail.expires || "-"}
                                    </div>
                                    <p className="text-xs text-foreground">{capDetail.description}</p>
                                    {capDetail.web && (
                                        <Link href={capDetail.web} target="_blank" className="text-xs text-primary">
                                            Infografik BMKG
                                        </Link>
                                    )}
                                    <div className="mt-2 w-full h-64 rounded-md overflow-hidden border">
                                        <LeafletMap sensors={[]} geoJsonData={geoJson} center={mapCenter} onSensorClick={() => {}} />
                                    </div>
                                </div>
                            )}
                            {!capDetail && !loadingCap && (
                                <div className="text-sm text-muted-foreground">
                                    Pilih salah satu peringatan untuk melihat detail wilayah terdampak.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            <div className="text-xs text-muted-foreground">
                Batas akses: 60 permintaan/menit per IP. Data diputakhirkan setiap saat. Validitas CAP: terverifikasi melalui
                CAP Validator. Harap cantumkan BMKG sebagai sumber data pada aplikasi.
            </div>
        </div>
    );
}
