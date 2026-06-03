"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, Info, Layers, X, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeafletMap } from "@/components/ui/custom/LeafletMap";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useOpenDataDesaStunting } from "@/hooks/useOpenDataDesaStunting";
import { opendataConfig } from "@/lib/opendata-config";
import * as turf from "@turf/turf";

export default function KecamatanDashboard({ params }: { params: Promise<{ nama: string }> }) {
    const { nama } = React.use(params);
    const kecamatanName = nama.replace(/-/g, " ");
    
    // Auto-detect Resource ID based on Kecamatan name
    const resourceId = opendataConfig.getStuntingResourceIdByKecamatan(kecamatanName);

    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
    const [selectedVillage, setSelectedVillage] = useState<any>(null);
    
    // Controls which layer data is shown on map
    const [activeLayer, setActiveLayer] = useState<"stunting-desa">("stunting-desa");
    const [showInfoPanel, setShowInfoPanel] = useState(true);
    
    // Fetch OpenData
    const { desaStuntingData, desaStuntingLoading } = useOpenDataDesaStunting(resourceId);

    useEffect(() => {
        fetch('/peta_desa.geojson')
            .then(res => res.json())
            .then((data: any) => {
                // Filter GeoJSON to only include villages in this kecamatan
                const filteredFeatures = data.features.filter((f: any) => {
                    const kec = f.properties?.Kecamatan || "";
                    return kec.toLowerCase().includes(kecamatanName.toLowerCase());
                });

                const filteredGeoJson = {
                    ...data,
                    features: filteredFeatures
                };

                setGeoJsonData(filteredGeoJson);

                // Calculate bounding box using Turf.js
                if (filteredFeatures.length > 0) {
                    try {
                        const bbox = turf.bbox(filteredGeoJson);
                        // bbox is [minX, minY, maxX, maxY] -> [minLng, minLat, maxLng, maxLat]
                        // Leaflet bounds are [[minLat, minLng], [maxLat, maxLng]]
                        setBounds([
                            [bbox[1], bbox[0]], 
                            [bbox[3], bbox[2]]
                        ]);
                    } catch (error) {
                        console.error("Error calculating bounds:", error);
                    }
                }
            })
            .catch(err => console.error("Gagal memuat peta_desa.geojson", err));
    }, [kecamatanName]);

    const handleFeatureClick = (feature: any) => {
        if (feature.isDesaStuntingLayer) {
            const villageName = feature?.properties?.Nama_Desa_ || feature?.properties?.name || "Desa Tidak Diketahui";
            setSelectedVillage({
                name: villageName,
                stuntingData: feature.desaStuntingData || null
            });
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-slate-900 relative font-sans">
            {/* 1. Full Screen Map */}
            <div className="absolute inset-0 z-0">
                {geoJsonData && (
                    <LeafletMap 
                        sensors={[]} 
                        geoJsonData={geoJsonData}
                        center={[-7.3986, 109.6963]} // Default center, will be overridden by bounds
                        onSensorClick={() => {}}
                        onFeatureClick={handleFeatureClick}
                        activeMapLayer={activeLayer}
                        desaStuntingData={desaStuntingData}
                        bounds={bounds}
                    />
                )}
            </div>

            {/* 2. Top Header Navigation (Floating) */}
            <div className="absolute top-0 left-0 right-0 z-[400] p-4 pointer-events-none flex flex-col sm:flex-row justify-between items-end sm:items-start gap-4">
                <div className="flex gap-4 items-start pointer-events-auto self-start">
                    <Link href="/kabupaten" className="h-10 w-10 bg-white/90 backdrop-blur rounded-xl shadow-md flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-white transition-colors border border-slate-200">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-slate-200 px-5 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 shadow-none hover:bg-indigo-200">Level Kecamatan</Badge>
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-none"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>Live</Badge>
                        </div>
                        <h1 className="text-xl font-black text-slate-900 capitalize">Kecamatan {kecamatanName}</h1>
                    </div>
                </div>

                {/* 3. Layer Controls */}
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 w-72 overflow-hidden pointer-events-auto">
                    <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center cursor-pointer" onClick={() => setShowInfoPanel(!showInfoPanel)}>
                        <h2 className="text-sm font-bold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-400" /> Layer Data Desa</h2>
                    </div>
                    {showInfoPanel && (
                        <div className="p-4 space-y-5">
                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="layer-stunting" className="flex flex-col gap-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800 text-sm">Kasus Stunting (Desa)</span>
                                        {desaStuntingLoading && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Memuat data API OpenData..."></span>}
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium line-clamp-2">Jumlah Balita Stunting per Desa (OpenData)</span>
                                </Label>
                                <Checkbox id="layer-stunting" checked={activeLayer === "stunting-desa"} onCheckedChange={(c) => c && setActiveLayer("stunting-desa")} className="w-5 h-5 rounded-md border-red-500 text-red-600 focus-visible:ring-red-500" />
                            </div>

                            <div className="h-px bg-slate-200 my-2"></div>

                            {/* Legend Display */}
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Legenda Peta</h3>
                                {activeLayer === "stunting-desa" && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-red-600 opacity-70"></span> Sangat Tinggi (&gt;20%)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-red-500 opacity-70"></span> Tinggi (15-20%)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-orange-500 opacity-70"></span> Sedang (10-15%)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-emerald-500 opacity-70"></span> Rendah (&lt;10%)</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Floating Village Details Modal */}
            {selectedVillage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] w-[90vw] max-w-md pointer-events-auto">
                    <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                        {/* Modal Header */}
                        <div className="bg-slate-900 px-5 py-4 flex justify-between items-start">
                            <div>
                                <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/20 border-0 mb-2">
                                    <Home className="w-3 h-3 mr-1 inline"/> Tingkat Desa
                                </Badge>
                                <h2 className="text-2xl font-black text-white leading-none mb-1 capitalize">{selectedVillage.name.toLowerCase()}</h2>
                                <p className="text-slate-400 text-sm capitalize">Kecamatan {kecamatanName.toLowerCase()}</p>
                            </div>
                            <button onClick={() => setSelectedVillage(null)} className="text-slate-400 hover:text-white bg-white/10 rounded-full p-1 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <CardContent className="p-0">
                            <div className="p-5">
                                {selectedVillage.stuntingData ? (
                                    <div className="space-y-6">
                                        <div className="bg-red-50 rounded-xl p-4 mb-5 border border-red-100 flex items-start gap-3">
                                            <Info className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-900 font-medium">Data bersumber dari API OpenData Banjarnegara (Tahun {selectedVillage.stuntingData.Tahun || "-"}).</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Statistik Stunting Balita</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white border rounded-xl p-3 shadow-sm">
                                                    <div className="text-xs text-slate-500 mb-1">Total Balita</div>
                                                    <div className="text-xl font-bold text-slate-800">{selectedVillage.stuntingData["Jumlah Seluruh Balita"]} <span className="text-sm font-normal text-slate-500">Jiwa</span></div>
                                                </div>
                                                <div className="bg-red-600 rounded-xl p-3 shadow-sm text-white">
                                                    <div className="text-xs text-red-100 mb-1">Balita Stunting</div>
                                                    <div className="text-xl font-bold">{selectedVillage.stuntingData["Jumlah Balita Stunting"]} <span className="text-sm font-normal text-red-200">Anak</span></div>
                                                </div>
                                                <div className="bg-white border rounded-xl p-3 shadow-sm col-span-2">
                                                    <div className="text-xs text-slate-500 mb-1">Persentase Kasus</div>
                                                    <div className="text-xl font-bold text-slate-800 flex items-center justify-between">
                                                        <span>{selectedVillage.stuntingData["Persentase* (%)"]}</span>
                                                        <div className="w-1/2 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-red-500" 
                                                                style={{width: selectedVillage.stuntingData["Persentase* (%)"]}}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-slate-400 font-medium italic">
                                        Data spesifik OpenData untuk desa ini belum tersedia.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
