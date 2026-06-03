"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Users, Building, Heart, Server, Activity, ArrowUpRight, Award, ShieldCheck, CheckCircle2, Globe, Layers, X, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText } from "lucide-react";
import { LeafletMap } from "@/components/ui/custom/LeafletMap";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useOpenDataPKK } from "@/hooks/useOpenDataPKK";
import { useOpenDataKB } from "@/hooks/useOpenDataKB";

import { useOpenDataKesejahteraan } from "@/hooks/useOpenDataKesejahteraan";

export type MapLayer = "digital" | "stunting" | "kemiskinan" | "penduduk" | "pkk" | "kb" | "kesejahteraan";

export default function KabupatenDashboard() {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [selectedVillage, setSelectedVillage] = useState<any>(null);
    const [realData, setRealData] = useState<Record<string, any>>({});
    const [kecamatanGeoJsonData, setKecamatanGeoJsonData] = useState<any>(null);
    
    // Controls which layer data is shown on map
    const [activeLayer, setActiveLayer] = useState<MapLayer>("digital");
    const [showInfoPanel, setShowInfoPanel] = useState(true);
    
    // Fetch OpenData
    const { pkkData, loading: pkkLoading } = useOpenDataPKK();
    const { kbData, kbLoading } = useOpenDataKB();
    const { kesejahteraanData, kesejahteraanLoading } = useOpenDataKesejahteraan();

    React.useEffect(() => {
        fetch('/peta_desa.geojson')
            .then(res => res.json())
            .then(data => setGeoJsonData(data))
            .catch(err => console.error("Gagal memuat peta_desa.geojson", err));

        fetch('/desa_data.json')
            .then(res => res.json())
            .then(data => setRealData(data))
            .catch(err => console.error("Gagal memuat desa_data.json", err));
            
        fetch('/peta_kecamatan.geojson?v=3')
            .then(res => res.json())
            .then(data => setKecamatanGeoJsonData(data))
            .catch(err => console.error("Gagal memuat peta_kecamatan.geojson", err));
    }, []);

    const mapMarkers: any[] = [
        { id: "ST-01", name: "Zona Stunting Tinggi", type: "seismic", lat: -7.3820, lng: 109.6500, status: "critical", value: 24, unit: "%", lastUpdate: "Baru saja", location: "Kecamatan Bawang", battery: 100, description: "Area dengan prevalensi stunting tinggi" },
        { id: "KM-01", name: "Konsentrasi RTLH", type: "power", lat: -7.4100, lng: 109.6800, status: "warning", value: 450, unit: "KK", lastUpdate: "Baru saja", location: "Kecamatan Banjarnegara", battery: 100, description: "Titik konsentrasi keluarga rentan" },
        { id: "DG-01", name: "Desa Digital Terbaik", type: "energy", lat: -7.2100, lng: 109.8300, status: "active", value: 100, unit: "Skor", lastUpdate: "Baru saja", location: "Desa Batur", battery: 100, description: "Desa dengan integrasi SID penuh" },
    ];

    const handleFeatureClick = (feature: any) => {
        // Jika feature ini berasal dari layer PKK (peta kecamatan)
        if (feature.isKecamatanLayer) {
            setSelectedVillage({
                isKecamatan: true,
                name: feature?.properties?.Kecamatan || feature?.properties?.Name || "Kecamatan Tidak Diketahui",
                kec: "",
                pkkData: feature.pkkData || null,
                kbData: feature.kbData || null,
                kesejahteraanData: feature.kesejahteraanData || null
            });
            return;
        }

        const name = feature?.properties?.Nama_Desa_ || feature?.properties?.name || "Desa Tidak Diketahui";
        const kec = feature?.properties?.Kecamatan || "Kecamatan";
        
        const cleanKec = kec.replace(/kecamatan/i, '').replace(/kec\./i, '').trim().toUpperCase();
        const cleanDesa = name.toUpperCase();
        const upperName = cleanDesa + "_" + cleanKec;
        
        const villageData = realData[upperName] || { isDigital: false, pop: "0", website: null, provider: "Belum Ada" };
        const isDigital = villageData.isDigital;
        
        // Mock Stunting & Poverty data based on name length for consistency
        let hash = 0;
        for (let i = 0; i < upperName.length; i++) {
            hash = upperName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const mockStunting = (Math.abs(hash) % 15) + 5; // 5% to 20%
        const mockKemiskinan = (Math.abs(hash) % 25) + 10; // 10% to 35%
        
        setSelectedVillage({
            name,
            kec,
            isDigital,
            pop: villageData.pop,
            website: villageData.website,
            provider: villageData.provider,
            stunting: mockStunting,
            kemiskinan: mockKemiskinan,
            news: [
                { id: 1, date: "Hari Ini", title: `Informasi Terbaru dari ${name}`, source: isDigital ? "Website Desa" : "Pemkab Banjarnegara" },
            ]
        });
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-slate-900 relative font-sans">
            {/* 1. Full Screen Map */}
            <div className="absolute inset-0 z-0">
                <LeafletMap 
                    sensors={mapMarkers} 
                    geoJsonData={geoJsonData}
                    center={[-7.3986, 109.6963]} 
                    onSensorClick={() => {}}
                    onFeatureClick={handleFeatureClick}
                    digitalStatusMap={Object.keys(realData).reduce((acc, key) => { acc[key] = realData[key].isDigital; return acc; }, {} as Record<string, boolean>)}
                    activeMapLayer={activeLayer}
                    kecamatanGeoJsonData={kecamatanGeoJsonData}
                    pkkData={pkkData}
                    kbData={kbData}
                    kesejahteraanData={kesejahteraanData}
                />
            </div>

            {/* 2. Top Header Navigation (Floating) */}
            <div className="absolute top-0 left-0 right-0 z-[400] p-4 pointer-events-none flex flex-col sm:flex-row justify-between items-end sm:items-start gap-4">
                <div className="flex gap-4 items-start pointer-events-auto self-start">
                    <Link href="/" className="h-10 w-10 bg-white/90 backdrop-blur rounded-xl shadow-md flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-white transition-colors border border-slate-200">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-slate-200 px-5 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 shadow-none hover:bg-indigo-200">Super Map</Badge>
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-none"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>Live</Badge>
                        </div>
                        <h1 className="text-xl font-black text-slate-900">Banjarnegara Command Center</h1>
                    </div>
                </div>

                {/* 3. Layer Controls (Checkboxes/Switches) */}
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 w-72 overflow-hidden pointer-events-auto">
                    <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center cursor-pointer" onClick={() => setShowInfoPanel(!showInfoPanel)}>
                        <h2 className="text-sm font-bold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-400" /> Kontrol Lapisan Data</h2>
                    </div>
                    {showInfoPanel && (
                        <div className="p-4 space-y-5">
                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="layer-digital" className="flex flex-col gap-1 cursor-pointer">
                                    <span className="font-bold text-slate-800 text-sm">Desa Digital (SID)</span>
                                    <span className="text-xs text-slate-500 font-medium">Ketersediaan sistem database</span>
                                </Label>
                                <Checkbox id="layer-digital" checked={activeLayer === "digital"} onCheckedChange={(c) => c && setActiveLayer("digital")} className="w-5 h-5 rounded-md" />
                            </div>
                            
                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="layer-stunting" className="flex flex-col gap-1 cursor-pointer">
                                    <span className="font-bold text-slate-800 text-sm">Risiko Stunting</span>
                                    <span className="text-xs text-slate-500 font-medium">Pemetaan persentase balita</span>
                                </Label>
                                <Checkbox id="layer-stunting" checked={activeLayer === "stunting"} onCheckedChange={(c) => c && setActiveLayer("stunting")} className="w-5 h-5 rounded-md" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="layer-kemiskinan" className="flex flex-col gap-1 cursor-pointer">
                                    <span className="font-bold text-slate-800 text-sm">Keluarga Rentan</span>
                                    <span className="text-xs text-slate-500 font-medium">Berdasarkan data RTLH</span>
                                </Label>
                                <Checkbox id="layer-kemiskinan" checked={activeLayer === "kemiskinan"} onCheckedChange={(c) => c && setActiveLayer("kemiskinan")} className="w-5 h-5 rounded-md" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="layer-pkk" className="flex flex-col gap-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800 text-sm">Batas Kecamatan (PKK)</span>
                                        {pkkLoading && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Memuat data API OpenData..."></span>}
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium line-clamp-2">Percontohan Home Industri & Rumah Sehat (OpenData)</span>
                                </Label>
                                <Checkbox id="layer-pkk" checked={activeLayer === "pkk"} onCheckedChange={(c) => c && setActiveLayer("pkk")} className="w-5 h-5 rounded-md border-indigo-500 text-indigo-600 focus-visible:ring-indigo-500" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="layer-kb" className="flex flex-col gap-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800 text-sm">Batas Kecamatan (KB)</span>
                                        {kbLoading && <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" title="Memuat data API OpenData..."></span>}
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium line-clamp-2">Akseptor Aktif & Akseptor Baru (OpenData)</span>
                                </Label>
                                <Checkbox id="layer-kb" checked={activeLayer === "kb"} onCheckedChange={(c) => c && setActiveLayer("kb")} className="w-5 h-5 rounded-md border-pink-500 text-pink-600 focus-visible:ring-pink-500" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <Label htmlFor="layer-kesejahteraan" className="flex flex-col gap-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800 text-sm">Batas Kecamatan (Kesejahteraan)</span>
                                        {kesejahteraanLoading && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Memuat data API OpenData..."></span>}
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium line-clamp-2">Status Kesejahteraan (Desil 1-4) (OpenData)</span>
                                </Label>
                                <Checkbox id="layer-kesejahteraan" checked={activeLayer === "kesejahteraan"} onCheckedChange={(c) => c && setActiveLayer("kesejahteraan")} className="w-5 h-5 rounded-md border-orange-500 text-orange-600 focus-visible:ring-orange-500" />
                            </div>

                            <div className="h-px bg-slate-200 my-2"></div>

                            {/* Legend Display based on Active Layer */}
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Legenda Peta</h3>
                                {activeLayer === "digital" && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-blue-500 opacity-70"></span> Sudah Terdigitalisasi</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-yellow-400 opacity-70"></span> Belum Digital</div>
                                    </div>
                                )}
                                {activeLayer === "stunting" && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-red-600 opacity-70"></span> Risiko Tinggi (&gt;15%)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-orange-400 opacity-70"></span> Risiko Sedang (10-15%)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-green-500 opacity-70"></span> Risiko Rendah (&lt;10%)</div>
                                    </div>
                                )}
                                {activeLayer === "kemiskinan" && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-purple-600 opacity-70"></span> Sangat Rentan (&gt;30%)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-purple-400 opacity-70"></span> Rentan (20-30%)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-slate-300 opacity-70"></span> Terkendali (&lt;20%)</div>
                                    </div>
                                )}
                                {activeLayer === "pkk" && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-indigo-600 opacity-70"></span> Home Industri Tinggi (&gt;2000)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-indigo-400 opacity-70"></span> Menengah (1000-2000)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-indigo-200 opacity-70"></span> Rendah (&lt;1000)</div>
                                    </div>
                                )}
                                {activeLayer === "kb" && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-pink-600 opacity-70"></span> Akseptor Aktif Tinggi (&gt;5000)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-pink-400 opacity-70"></span> Menengah (3000-5000)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-pink-200 opacity-70"></span> Rendah (&lt;3000)</div>
                                    </div>
                                )}
                                {activeLayer === "kesejahteraan" && (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-orange-600 opacity-70"></span> Desil 1 (Sangat Miskin) &gt;10000</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-orange-400 opacity-70"></span> Menengah (5000-10000)</div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700"><span className="w-3 h-3 rounded bg-orange-200 opacity-70"></span> Rendah (&lt;5000)</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. KPI Floater Bottom Left */}
            <div className="absolute bottom-6 left-6 z-[400] pointer-events-none flex gap-4">
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-4 w-44 pointer-events-auto flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><Users className="w-5 h-5"/></div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Total Penduduk</div>
                        <div className="font-black text-slate-800">1.04M <span className="text-xs font-bold text-slate-400">Jiwa</span></div>
                    </div>
                </div>
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-4 w-44 pointer-events-auto flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600"><Server className="w-5 h-5"/></div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Desa Digital</div>
                        <div className="font-black text-slate-800">175 <span className="text-xs font-bold text-slate-400">Desa</span></div>
                    </div>
                </div>
            </div>

            {/* 5. Floating Village/Kecamatan Details Modal */}
            {selectedVillage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] w-[90vw] max-w-md pointer-events-auto">
                    <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                        {/* Modal Header */}
                        <div className="bg-slate-900 px-5 py-4 flex justify-between items-start">
                            <div>
                                <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/20 border-0 mb-2">
                                    {selectedVillage.isKecamatan ? "Data Wilayah" : selectedVillage.isDigital ? "Desa Digital" : "Desa Reguler"}
                                </Badge>
                                <h2 className="text-2xl font-black text-white leading-none mb-1">{selectedVillage.name}</h2>
                                {!selectedVillage.isKecamatan && <p className="text-slate-400 text-sm">{selectedVillage.kec}</p>}
                            </div>
                            <button onClick={() => setSelectedVillage(null)} className="text-slate-400 hover:text-white bg-white/10 rounded-full p-1 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <CardContent className="p-0">
                            {selectedVillage.isKecamatan ? (
                                /* KECAMATAN (PKK) CONTENT */
                                <div className="p-5">
                                    {selectedVillage.pkkData && (
                                        <div className="bg-indigo-50 rounded-xl p-4 mb-5 border border-indigo-100 flex items-start gap-3">
                                            <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                                            <p className="text-sm text-indigo-900 font-medium">Data bersumber dari API OpenData Banjarnegara (TP-PKK Tahun {selectedVillage.pkkData.Tahun || "-"}).</p>
                                        </div>
                                    )}

                                    {selectedVillage.pkkData ? (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Industri Rumahan (Pemberdayaan)</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-white border rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-slate-500 mb-1">Pangan</div>
                                                        <div className="text-xl font-bold text-slate-800">{selectedVillage.pkkData.Pangan}</div>
                                                    </div>
                                                    <div className="bg-white border rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-slate-500 mb-1">Sandang/Konveksi</div>
                                                        <div className="text-xl font-bold text-slate-800">{parseInt(selectedVillage.pkkData.Sandang || "0") + parseInt(selectedVillage.pkkData.Konveksi || "0")}</div>
                                                    </div>
                                                    <div className="bg-white border rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-slate-500 mb-1">Jasa</div>
                                                        <div className="text-xl font-bold text-slate-800">{selectedVillage.pkkData.Jasa}</div>
                                                    </div>
                                                    <div className="bg-indigo-600 rounded-xl p-3 shadow-sm text-white">
                                                        <div className="text-xs text-indigo-100 mb-1">Total UMKM</div>
                                                        <div className="text-xl font-bold">{selectedVillage.pkkData["Jumlah Percontohan Home Industri"]}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Kualitas Lingkungan (Rumah Sehat)</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                                                        <div className="text-xs text-emerald-600 mb-1">Rumah Sehat</div>
                                                        <div className="text-xl font-bold text-emerald-700">{selectedVillage.pkkData["Rumah Sehat"]}</div>
                                                    </div>
                                                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
                                                        <div className="text-xs text-rose-600 mb-1">Kurang Sehat</div>
                                                        <div className="text-xl font-bold text-rose-700">{selectedVillage.pkkData["Rumah Kurang Sehat"]}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : selectedVillage.kbData ? (
                                        <div className="space-y-6">
                                            <div className="bg-pink-50 rounded-xl p-4 mb-2 border border-pink-100 flex items-start gap-3">
                                                <Info className="h-5 w-5 text-pink-600 shrink-0 mt-0.5" />
                                                <p className="text-sm text-pink-900 font-medium">Data bersumber dari API OpenData Banjarnegara (KB Tahun {selectedVillage.kbData.Tahun || "-"}).</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Akseptor Keluarga Berencana</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-white border rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-slate-500 mb-1">Akseptor Baru</div>
                                                        <div className="text-xl font-bold text-slate-800">{selectedVillage.kbData.Baru}</div>
                                                    </div>
                                                    <div className="bg-pink-600 rounded-xl p-3 shadow-sm text-white">
                                                        <div className="text-xs text-pink-100 mb-1">Akseptor Aktif</div>
                                                        <div className="text-xl font-bold">{selectedVillage.kbData.Aktif}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : selectedVillage.kesejahteraanData ? (
                                        <div className="space-y-6">
                                            <div className="bg-orange-50 rounded-xl p-4 mb-2 border border-orange-100 flex items-start gap-3">
                                                <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                                                <p className="text-sm text-orange-900 font-medium">Data bersumber dari API OpenData Banjarnegara (Kesejahteraan Tahun {selectedVillage.kesejahteraanData.Tahun || "-"}).</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Status Kesejahteraan Individu</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-orange-600 rounded-xl p-3 shadow-sm text-white">
                                                        <div className="text-xs text-orange-100 mb-1">Desil 1 (Sangat Miskin)</div>
                                                        <div className="text-xl font-bold">{selectedVillage.kesejahteraanData["Status Kesejahteraan 1"]}</div>
                                                    </div>
                                                    <div className="bg-white border rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-slate-500 mb-1">Desil 2 (Miskin)</div>
                                                        <div className="text-xl font-bold text-slate-800">{selectedVillage.kesejahteraanData["Status Kesejahteraan 2"]}</div>
                                                    </div>
                                                    <div className="bg-white border rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-slate-500 mb-1">Desil 3 (Rentan Miskin)</div>
                                                        <div className="text-xl font-bold text-slate-800">{selectedVillage.kesejahteraanData["Status Kesejahteraan 3"]}</div>
                                                    </div>
                                                    <div className="bg-white border rounded-xl p-3 shadow-sm">
                                                        <div className="text-xs text-slate-500 mb-1">Desil 4 (Hampir Miskin)</div>
                                                        <div className="text-xl font-bold text-slate-800">{selectedVillage.kesejahteraanData["Status Kesejahteraan 4"]}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 font-medium italic">Data Tidak Tersedia</span>
                                    )}
                                </div>
                            ) : (
                                /* REGULAR DESA CONTENT */
                                <div className="p-5 space-y-5">
                                    {/* Status Pills */}
                                    <div className="flex gap-2">
                                        <Badge className={`px-2.5 py-1 ${selectedVillage.isDigital ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`} variant="outline">
                                            {selectedVillage.isDigital ? 'Desa Digital OpenSID' : 'Belum Digital'}
                                        </Badge>
                                        <Badge className="bg-slate-50 text-slate-600 border-slate-200 px-2.5 py-1" variant="outline">
                                            <Users className="w-3 h-3 mr-1 inline"/> {selectedVillage.pop} Jiwa
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Prevalensi Stunting</div>
                                            <div className="text-xl font-black flex items-end gap-1">
                                                <span className={selectedVillage.stunting > 15 ? 'text-red-600' : selectedVillage.stunting > 10 ? 'text-orange-500' : 'text-emerald-600'}>
                                                    {selectedVillage.stunting}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                                                <div className={`h-full ${selectedVillage.stunting > 15 ? 'bg-red-500' : selectedVillage.stunting > 10 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{width: `${(selectedVillage.stunting/25)*100}%`}}></div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Keluarga Rentan</div>
                                            <div className="text-xl font-black flex items-end gap-1">
                                                <span className={selectedVillage.kemiskinan > 30 ? 'text-purple-600' : selectedVillage.kemiskinan > 20 ? 'text-purple-400' : 'text-slate-600'}>
                                                    {selectedVillage.kemiskinan}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                                                <div className={`h-full ${selectedVillage.kemiskinan > 30 ? 'bg-purple-600' : selectedVillage.kemiskinan > 20 ? 'bg-purple-400' : 'bg-slate-400'}`} style={{width: `${(selectedVillage.kemiskinan/40)*100}%`}}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold text-slate-500 flex items-center gap-1.5"><Globe className="w-4 h-4"/> Website Portal</span>
                                            {selectedVillage.isDigital && selectedVillage.website ? (
                                                <a href={selectedVillage.website} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                                    Kunjungi <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 font-medium italic">Tidak Tersedia</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> Provider Integrasi</span>
                                            <span className="font-bold text-slate-800">{selectedVillage.provider}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 pt-2">
                                        <Link href={`/desa/${selectedVillage.kec ? selectedVillage.kec.toLowerCase().replace(/kecamatan/g, '').replace(/kec\./g, '').trim().replace(/ /g, "-") : 'unknown'}/${selectedVillage.name.toLowerCase().replace(/desa/g, '').replace(/kelurahan/g, '').trim().replace(/ /g, "-")}`} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-center transition-colors">
                                            Profil Lengkap
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
