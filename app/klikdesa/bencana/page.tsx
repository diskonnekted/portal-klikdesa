"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ShieldCheck, Eye, CloudRain, Radio, MapPin, Activity, HardDrive, Compass, Thermometer, Play, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { LeafletMap } from "@/components/ui/custom/LeafletMap";

interface IoTSensor {
    id: string;
    name: string;
    type:
        | "seismic"
        | "water-level"
        | "rainfall"
        | "weather"
        | "air-quality"
        | "ground-tilt"
        | "wind"
        | "temperature"
        | "voltage"
        | "current"
        | "power"
        | "energy"
        | "cost"
        | "humidity"
        | "cctv";
    lat: number;
    lng: number;
    status: "active" | "inactive" | "warning" | "critical";
    value: number;
    unit: string;
    lastUpdate: string;
    location: string;
    battery: number;
    description: string;
}

interface CCTV {
    name: string;
    status: string;
    desc: string;
    src: string;
    placeholder: string;
}

const CCTVCard = ({ cctv, index }: { cctv: CCTV; index: number }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
        setIsLoading(true);
    };

    const isMp4 = cctv.src.endsWith(".mp4");

    return (
        <div className="space-y-2 p-3.5 rounded-xl bg-cyan-50/40 border border-cyan-100 hover:border-cyan-300 transition-colors duration-300 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center text-xs text-cyan-800 font-bold mb-2.5">
                    <span className="truncate max-w-[150px] sm:max-w-none">{cctv.name}</span>
                    <Badge className={`${
                        cctv.status === "SIAGA" ? "bg-amber-100 text-amber-800 border-amber-200" :
                        "bg-emerald-100 text-emerald-800 border-emerald-250"
                    } scale-90 border font-bold text-[9px] px-1.5 py-0.5`}>
                        {cctv.status}
                    </Badge>
                </div>
                <div className="aspect-video bg-slate-900 rounded-lg relative group cursor-pointer overflow-hidden" onClick={!isPlaying ? handlePlay : undefined}>
                    {!isPlaying ? (
                        <>
                            <img 
                                src={cctv.placeholder} 
                                alt={cctv.name}
                                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/50 p-3 rounded-full group-hover:bg-cyan-500/30 transition-all duration-300">
                                    <Play className="h-6 w-6 text-cyan-500 fill-cyan-500" />
                                </div>
                            </div>
                            <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                <Activity className="h-2.5 w-2.5 text-red-500 animate-pulse" /> Live
                            </div>
                        </>
                    ) : (
                        <>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
                                    <Loader2 className="h-6 w-6 text-cyan-500 animate-spin" />
                                </div>
                            )}
                            {isMp4 ? (
                                <video 
                                    src={cctv.src}
                                    className="w-full h-full border-0 relative z-0"
                                    autoPlay
                                    controls
                                    loop
                                    muted
                                    onCanPlay={() => setIsLoading(false)}
                                />
                            ) : (
                                <iframe 
                                    src={`${cctv.src}${cctv.src.includes('?') ? '&' : '?'}autoplay=1`}
                                    className="w-full h-full border-0 relative z-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    onLoad={() => setIsLoading(false)}
                                ></iframe>
                            )}
                        </>
                    )}
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white px-1.5 py-0.5 rounded text-[8px] font-mono pointer-events-none z-20">
                        CH: 0{index + 1}
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-2.5">{cctv.desc}</p>
        </div>
    );
};

// Region coordinates map
const villageCoordinates: { [key: string]: { lat: number; lng: number } } = {
    // Banjarmangu
    "Desa Sijenggung": { lat: -7.2929, lng: 109.6680 },
    "Desa Jenggawur": { lat: -7.3995, lng: 109.6200 },
    "Desa Banjarkulon": { lat: -7.3680, lng: 109.6050 },
    "Desa Banjarmangu": { lat: -7.3712, lng: 109.6190 },
    "Desa Beji": { lat: -7.3690, lng: 109.6250 },
    "Desa Gripit": { lat: -7.3550, lng: 109.6420 },
    "Desa Kalilunjar": { lat: -7.3580, lng: 109.6100 },
    "Desa Kendaga": { lat: -7.3820, lng: 109.6010 },
    "Desa Kesenet": { lat: -7.3650, lng: 109.6300 },
    // Purwareja Klampok
    "Desa Klampok": { lat: -7.4589, lng: 109.5211 },
    "Desa Purwareja": { lat: -7.4611, lng: 109.5198 },
    "Desa Kalilandak": { lat: -7.4660, lng: 109.5300 },
    "Desa Kecitran": { lat: -7.4520, lng: 109.5100 },
    "Desa Kalimandi": { lat: -7.4490, lng: 109.5450 },
    "Desa Sirkandi": { lat: -7.4720, lng: 109.5550 },
    // Banjarnegara
    "Desa Ampelsari": { lat: -7.4100, lng: 109.6750 },
    "Desa Cendana": { lat: -7.3880, lng: 109.7200 },
    "Desa Sokayasa": { lat: -7.3950, lng: 109.7020 },
    "Desa Tlagawera": { lat: -7.4050, lng: 109.6950 },
    // Mandiraja
    "Desa Mandiraja Kulon": { lat: -7.4690, lng: 109.5780 },
    "Desa Mandiraja Wetan": { lat: -7.4710, lng: 109.5840 },
    "Desa Kebanaran": { lat: -7.4920, lng: 109.5920 },
    "Desa Somawangi": { lat: -7.4990, lng: 109.5700 }
};

import { regionData } from "@/lib/regionsData";

// Raw list of telemetry sensors in Banjarnegara
const allSensors: IoTSensor[] = [
    {
        id: "EWS-SL-01",
        name: "EWS Longsor Sijenggung",
        type: "ground-tilt",
        lat: -7.2929,
        lng: 109.6680,
        status: "warning",
        value: 1.2,
        unit: "mm",
        lastUpdate: "Baru saja",
        location: "Dusun Sijenggung, Banjarmangu",
        battery: 89,
        description: "Pendeteksi pergerakan kemiringan tanah lereng rawan longsor Dusun Sijenggung."
    },
    {
        id: "EWS-WL-02",
        name: "Sensor Banjir DAS Klampok",
        type: "water-level",
        lat: -7.4589,
        lng: 109.5211,
        status: "active",
        value: 0.85,
        unit: "m",
        lastUpdate: "2 menit lalu",
        location: "Jembatan Klampok, Purwareja Klampok",
        battery: 95,
        description: "Monitoring ketinggian permukaan air sungai dan kecepatan aliran Sungai Klampok."
    },
    {
        id: "EWS-RF-03",
        name: "Rainfall Purwareja",
        type: "rainfall",
        lat: -7.4611,
        lng: 109.5198,
        status: "active",
        value: 12,
        unit: "mm",
        lastUpdate: "5 menit lalu",
        location: "Kantor Kecamatan Purwareja Klampok",
        battery: 84,
        description: "Ombrometer otomatis mencatat curah hujan harian untuk kalkulasi kejenuhan tanah."
    },
    {
        id: "EWS-SM-04",
        name: "Seismograf Karangkobar",
        type: "seismic",
        lat: -7.2844,
        lng: 109.7022,
        status: "active",
        value: 0.05,
        unit: "G",
        lastUpdate: "1 menit lalu",
        location: "Pos Pantau Karangkobar",
        battery: 100,
        description: "Sensor getaran mikro tanah mendeteksi tremor seismik lokal dan aktivitas tebing."
    },
    {
        id: "EWS-WE-05",
        name: "Weather Station Dieng",
        type: "weather",
        lat: -7.2185,
        lng: 109.8144,
        status: "active",
        value: 18,
        unit: "°C",
        lastUpdate: "10 menit lalu",
        location: "Batur, Dataran Tinggi Dieng",
        battery: 92,
        description: "Pemantauan cuaca ekstrem, kecepatan angin, kelembapan udara, dan suhu di zona Dieng."
    },
    {
        id: "EWS-SL-06",
        name: "EWS Longsor Kalilunjar",
        type: "ground-tilt",
        lat: -7.3580,
        lng: 109.6100,
        status: "active",
        value: 0.01,
        unit: "mm",
        lastUpdate: "4 menit lalu",
        location: "Bukit Kalilunjar, Banjarmangu",
        battery: 76,
        description: "Sensor inklinometer memantau stabilitas lereng jalan utama Kecamatan Banjarmangu."
    },
    {
        id: "EWS-SL-07",
        name: "EWS Longsor Kebanaran",
        type: "ground-tilt",
        lat: -7.4920,
        lng: 109.5920,
        status: "active",
        value: 0.15,
        unit: "mm",
        lastUpdate: "3 menit lalu",
        location: "Kebanaran Atas, Mandiraja",
        battery: 90,
        description: "Alat pendeteksi dini ancaman gerakan tanah struktural di area pemukiman perbukitan."
    },
    {
        id: "SJG1",
        name: "CCTV 01 - Dusun Sijenggung (Lereng Utama)",
        type: "cctv",
        lat: -7.2942,
        lng: 109.6635,
        status: "active",
        value: 0,
        unit: "",
        lastUpdate: "Baru saja",
        location: "Dusun Sijenggung (Jembatan Sungai 1)",
        battery: 100,
        description: "Visual real-time pemantauan aliran sungai dan lereng utama rawan longsor di Dusun Sijenggung."
    },
    {
        id: "SJG2",
        name: "CCTV 02 - Dusun Sijenggung (Jalan Desa)",
        type: "cctv",
        lat: -7.2918,
        lng: 109.6658,
        status: "active",
        value: 0,
        unit: "",
        lastUpdate: "Baru saja",
        location: "Dusun Sijenggung (Jembatan Sungai 2)",
        battery: 100,
        description: "Visual pemantauan akses jalan utama desa dan jembatan evakuasi aliran sungai Sijenggung."
    },
    {
        id: "SJG3",
        name: "CCTV 03 - Dusun Sijenggung (Posko Pengungsian)",
        type: "cctv",
        lat: -7.2895,
        lng: 109.6692,
        status: "active",
        value: 0,
        unit: "",
        lastUpdate: "Baru saja",
        location: "Dusun Sijenggung (Jembatan Sungai 3)",
        battery: 100,
        description: "Visual pemantauan area posko utama kesiapsiagaan tanggap darurat bencana."
    }
];

const waterLevelData = [
    { jam: "00:00", level: 0.32 },
    { jam: "01:00", level: 0.32 },
    { jam: "02:00", level: 0.31 },
    { jam: "03:00", level: 0.31 },
    { jam: "04:00", level: 0.30 },
    { jam: "05:00", level: 0.30 },
    { jam: "06:00", level: 0.31 },
    { jam: "07:00", level: 0.32 },
    { jam: "08:00", level: 0.32 },
    { jam: "09:00", level: 0.33 },
    { jam: "10:00", level: 0.33 },
    { jam: "11:00", level: 0.34 },
    { jam: "12:00", level: 0.34 },
    { jam: "13:00", level: 0.35 },
    { jam: "14:00", level: 0.35 },
    { jam: "15:00", level: 0.34 },
    { jam: "16:00", level: 0.34 },
    { jam: "17:00", level: 0.33 },
    { jam: "18:00", level: 0.33 },
    { jam: "19:00", level: 0.32 },
    { jam: "20:00", level: 0.32 },
    { jam: "21:00", level: 0.32 },
    { jam: "22:00", level: 0.31 },
    { jam: "23:00", level: 0.32 },
];

export default function BencanaPage() {
    const kecamatans = Object.keys(regionData);
    
    // States
    const [selectedKec, setSelectedKec] = useState("Kecamatan Banjarmangu");
    const [selectedDesa, setSelectedDesa] = useState("Desa Sijenggung");
    
    // Center map initialized to Desa Sijenggung
    const [mapCenter, setMapCenter] = useState<[number, number]>([-7.2929, 109.6680]);
    
    // Currently active / viewed sensor on panel
    const [selectedSensor, setSelectedSensor] = useState<IoTSensor>(allSensors[0]);

    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetch("/uploads/peta/SIJENGGUNG.geojson")
            .then((res) => res.json())
            .then((data) => {
                setGeoJsonData(data);
            })
            .catch((err) => {
                console.error("Failed to load GeoJSON:", err);
            });
    }, []);

    // Helper to get coordinates with automatic mathematical fallback centering around Banjarnegara
    const getCoordinates = (desaName: string) => {
        if (villageCoordinates[desaName]) return villageCoordinates[desaName];
        const seed = desaName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return {
            lat: -7.3996 + (seed % 100 - 50) / 1000,
            lng: 109.6974 + (seed % 120 - 60) / 1000
        };
    };

    // Handle Kecamatan change and reset selected Desa
    const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const kec = e.target.value;
        setSelectedKec(kec);
        const defaultDesa = regionData[kec][0];
        setSelectedDesa(defaultDesa);
        
        // Move map focus to new village
        const coord = getCoordinates(defaultDesa);
        setMapCenter([coord.lat, coord.lng]);
    };

    // Handle Desa change
    const handleDesaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const desa = e.target.value;
        setSelectedDesa(desa);
        
        // Move map focus
        const coord = getCoordinates(desa);
        setMapCenter([coord.lat, coord.lng]);
    };

    // Change map focus when user clicks on a sensor in the sidebar list
    const focusOnSensor = (sensor: IoTSensor) => {
        setSelectedSensor(sensor);
        setMapCenter([sensor.lat, sensor.lng]);
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-2 w-2 rounded-full bg-cyan-600 animate-pulse"></span>
                            <span className="text-xs font-semibold text-cyan-600 tracking-wider uppercase font-mono">OrionVersa Disaster Engine Active</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                            Ketahanan Bencana & Telemetri
                        </h1>
                        <p className="text-slate-500 mt-1">Sistem Peringatan Dini (EWS), Pemantauan Cuaca, Seismograf & Peta Risiko Kebencanaan Kabupaten Banjarnegara</p>
                    </div>
                    
                    {/* Live Status Badge & External Tool Links */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Link 
                            href="https://orionversapro.vercel.app/sungai" 
                            target="_blank"
                            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-cyan-500/50 transition px-4 py-2.5 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50"
                        >
                            <Compass className="h-4 w-4 text-cyan-600" />
                            OrionVersa Engine
                        </Link>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-cyan-650 text-sm font-semibold shadow-xs">
                            <Radio className="h-4 w-4 text-cyan-600 animate-pulse" />
                            Live BPBD-BMKG Feed Synchronized
                        </div>
                    </div>
                </div>

                {/* Region Filter Selector Card */}
                <Card className="bg-white border-slate-200 text-slate-800 shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <CardTitle className="text-base text-cyan-650 font-bold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Fokus Area Pemantauan Wilayah
                        </CardTitle>
                        <CardDescription className="text-slate-500 text-xs">
                            Pilih Kecamatan dan Desa untuk memfokuskan peta dan telemetri kebencanaan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500">Pilih Kecamatan</label>
                                <select 
                                    value={selectedKec} 
                                    onChange={handleKecChange}
                                    className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-hidden"
                                >
                                    {kecamatans.map((kec) => (
                                        <option key={kec} value={kec}>{kec}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500">Pilih Desa</label>
                                <select 
                                    value={selectedDesa} 
                                    onChange={handleDesaChange}
                                    className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-hidden"
                                >
                                    {regionData[selectedKec]?.map((desa) => (
                                        <option key={desa} value={desa}>{desa}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Alerts & Status Grid */}
                <div id="ews" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scroll-mt-28">
                    {/* Status EWS */}
                    <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                                Status EWS Sijenggung
                            </span>
                            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-amber-600 tracking-tight">SIAGA</div>
                            <p className="text-xs text-slate-400 mt-2 font-medium">Pergeseran lereng terdeteksi: 1.2 mm</p>
                        </div>
                    </Card>

                    {/* Curah Hujan */}
                    <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                                Curah Hujan Lokal
                            </span>
                            <CloudRain className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-cyan-600 tracking-tight">12 mm</div>
                            <p className="text-xs text-slate-400 mt-2 font-medium">Intensitas rendah/gerimis merata</p>
                        </div>
                    </Card>

                    {/* Kamera Telemetri */}
                    <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                                Kamera Telemetri
                            </span>
                            <Eye className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">6 Titik Aktif</div>
                            <p className="text-xs text-slate-400 mt-2 font-medium">Sistem stream CCTV normal</p>
                        </div>
                    </Card>

                    {/* Area Risiko Rawan */}
                    <Card className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                                Area Risiko Rawan
                            </span>
                            <Activity className="h-5 w-5 text-purple-500 flex-shrink-0" />
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-extrabold text-purple-600 tracking-tight">4 Zona Utama</div>
                            <p className="text-xs text-slate-400 mt-2 font-medium">Terpetakan di lereng Banjarnegara</p>
                        </div>
                    </Card>
                </div>

                {/* Main Interactive Map & Telemetry Dashboard Section */}
                <div id="pemetaan" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-28">
                    
                    {/* Live Telemetry Map */}
                    <Card className="lg:col-span-2 border-slate-200 bg-white text-slate-800 shadow-sm overflow-hidden min-h-[450px] lg:min-h-[550px] flex flex-col">
                        <CardHeader className="border-b border-slate-100 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-cyan-600 font-bold flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Peta Interaktif EWS Banjarnegara
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 text-xs">
                                        Menampilkan visualisasi sebaran stasiun telemetri curah hujan, getaran seismik, ketinggian air & sensor lereng
                                    </CardDescription>
                                </div>
                                <Badge className="bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-[10px]">
                                    {selectedDesa.toUpperCase()} FOCUS
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative min-h-[350px]">
                            <div className="absolute inset-0 z-10">
                                <LeafletMap 
                                    key="bencana-map"
                                    sensors={allSensors} 
                                    geoJsonData={geoJsonData} 
                                    center={mapCenter} 
                                    onSensorClick={(sensor) => setSelectedSensor(sensor)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sensor Details Sidebar / HUD Control */}
                    <div className="space-y-6">
                        
                        {/* Selected Sensor Diagnostics Panel */}
                        <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-3">
                                <div className="flex items-center justify-between">
                                    <Badge className={`${
                                        selectedSensor.status === "critical" ? "bg-red-50 border border-red-200 text-red-700" :
                                        selectedSensor.status === "warning" ? "bg-amber-50 border border-amber-200 text-amber-700" :
                                        "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                    } text-[10px] font-mono uppercase px-2 py-0.5`}>
                                        {selectedSensor.status}
                                    </Badge>
                                    <span className="text-[10px] text-slate-400 font-mono">{selectedSensor.id}</span>
                                </div>
                                <CardTitle className="text-base text-slate-800 font-bold mt-2">
                                    {selectedSensor.name}
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    {selectedSensor.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <div className="text-[10px] uppercase text-slate-400 font-semibold font-mono">Nilai Pengukuran</div>
                                        <div className="text-xl font-black text-cyan-600 mt-1 flex items-baseline gap-1">
                                            {selectedSensor.value}
                                            <span className="text-sm font-normal text-slate-500">{selectedSensor.unit}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <div className="text-[10px] uppercase text-slate-400 font-semibold font-mono">Daya Baterai</div>
                                        <div className="text-xl font-black text-emerald-600 mt-1 flex items-baseline gap-1">
                                            {selectedSensor.battery}%
                                            <span className="text-[10px] font-normal text-slate-500">Li-Ion</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-[10px] uppercase text-slate-400 font-semibold font-mono">Deskripsi Telemetri</div>
                                    <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        {selectedSensor.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-550 font-mono bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                                    <span>Sync Terakhir:</span>
                                    <span className="text-cyan-600">{selectedSensor.lastUpdate}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* List of Telemetry Stations */}
                        <Card className="border-slate-200 bg-white text-slate-800 shadow-sm max-h-[290px] overflow-hidden flex flex-col">
                            <CardHeader className="py-3 border-b border-slate-100 flex-shrink-0">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Stasiun Sensor Telemetri
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 overflow-y-auto flex-1 space-y-1 bg-slate-50/30">
                                {allSensors.map((sensor) => (
                                    <button
                                        key={sensor.id}
                                        onClick={() => focusOnSensor(sensor)}
                                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition border ${
                                            selectedSensor.id === sensor.id
                                                ? "bg-slate-100 border-cyan-500/40 text-slate-850 shadow-xs"
                                                : "bg-transparent border-transparent hover:bg-slate-100/50 text-slate-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2.5 w-2.5 rounded-full ${
                                                sensor.status === "critical" ? "bg-red-500 animate-pulse" :
                                                sensor.status === "warning" ? "bg-amber-500" :
                                                "bg-emerald-500"
                                            }`}></span>
                                            <div>
                                                <div className="text-xs font-semibold">{sensor.name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono">{sensor.id}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono text-cyan-600 font-bold">
                                            {sensor.value} {sensor.unit}
                                        </div>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* River Water Level Chart Section */}
                <div id="grafik-sungai" className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-cyan-600" />
                        Pantauan Hidrologi Ketinggian Air Sungai Kacangan Sijenggung (24 Jam Terakhir)
                    </h2>
                    <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-100 border-0 shadow-sm text-slate-800">
                        {/* Watermark Icon */}
                        <div className="absolute -top-6 -right-6 opacity-10 text-cyan-600 pointer-events-none">
                            <Activity className="h-40 w-40" />
                        </div>
                        <CardHeader className="pb-2 relative z-10 border-b border-cyan-200/50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-sm font-bold text-cyan-800 flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-cyan-700" />
                                        Sensor Telemetri WL-SJG - Sungai Kacangan
                                    </CardTitle>
                                    <CardDescription className="text-cyan-700/80 text-xs">
                                        Grafik fluktuasi level permukaan air sungai real-time 24 jam dengan batas aman/siaga bahaya.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Badge className="bg-emerald-600/20 text-emerald-800 hover:bg-emerald-600/30 border-none font-semibold text-xs">
                                        Status Saat Ini: 0.32m (Normal - Musim Kemarau)
                                    </Badge>
                                    <Badge className="bg-red-600/20 text-red-800 hover:bg-red-600/30 border-none font-semibold text-xs">
                                        Batas Siaga: 1.50m
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 h-[350px] relative z-10">
                            {mounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={waterLevelData}
                                        margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis 
                                            dataKey="jam" 
                                            stroke="#64748b" 
                                            fontSize={11} 
                                            tickLine={false}
                                        />
                                        <YAxis 
                                            stroke="#64748b" 
                                            fontSize={11} 
                                            domain={[0, 2.5]} 
                                            tickLine={false}
                                            unit="m"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#ffffff",
                                                borderColor: "#cbd5e1",
                                                color: "#0f172a",
                                                borderRadius: "12px",
                                                fontSize: "12px",
                                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                                            }}
                                            formatter={(value: any) => [`${value} meter`, "Ketinggian Air"]}
                                            labelFormatter={(label) => `Jam: ${label} WIB`}
                                        />
                                        <ReferenceLine 
                                            y={1.5} 
                                            stroke="#ef4444" 
                                            strokeDasharray="5 5" 
                                            label={{ value: "Siaga Banjir (1.50m)", position: "top", fill: "#ef4444", fontSize: 10, fontWeight: "bold" }} 
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="level"
                                            stroke="#06b6d4"
                                            strokeWidth={3}
                                            dot={{ r: 4, stroke: "#06b6d4", strokeWidth: 2, fill: "#ffffff" }}
                                            activeDot={{ r: 6, fill: "#06b6d4" }}
                                            name="Ketinggian Air"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* CCTV Telemetry Pantauan Bencana */}
                <div id="cctv" className="scroll-mt-28">
                    <Card className="bg-white border-slate-200 text-slate-800 shadow-sm">
                        <CardHeader className="gap-0 pb-3 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-2 text-lg text-cyan-700 font-bold">
                                <Eye className="h-5 w-5 text-cyan-600" />
                                Kamera CCTV Pemantau Kondisi Visual Kerawanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { 
                                        name: "CCTV 01 - Dusun Sijenggung (Lereng Utama)", 
                                        status: "SIAGA", 
                                        desc: "Visual waktu nyata (Real-time) pergerakan lereng utama rawan longsor di Dusun Sijenggung.", 
                                        src: "/images/sjg1.mp4",
                                        placeholder: "/images/cctv01.jpg"
                                    },
                                    { 
                                        name: "CCTV 02 - Dusun Sijenggung (Jalan Desa)", 
                                        status: "SIAGA", 
                                        desc: "Visual pemantauan akses jalan penghubung desa dan jembatan evakuasi Dusun Sijenggung.", 
                                        src: "/images/sjg2.mp4",
                                        placeholder: "/images/cctv02.jpg"
                                    },
                                    { 
                                        name: "CCTV 03 - Dusun Sijenggung (Posko Pengungsian)", 
                                        status: "NORMAL", 
                                        desc: "Pantauan visual area posko utama kesiapsiagaan dan shelter darurat evakuasi warga.", 
                                        src: "/images/sjg3.mp4",
                                        placeholder: "/images/cctv03.jpg"
                                    },
                                ].map((cctv, index) => (
                                    <CCTVCard key={cctv.name} cctv={cctv} index={index} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Evacuation Shelters & Disaster Maps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 border-slate-200 bg-white text-slate-800 shadow-sm">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-base text-slate-800 font-bold">Rencana Kesiapsiagaan & Evakuasi Terpadu</CardTitle>
                            <CardDescription className="text-slate-500 text-xs">Posko tanggap darurat yang siap menampung warga saat kondisi bahaya aktif</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {[
                                { Shelter: "Posko Utama Desa Jenggawur", capacity: "Kapasitas 350 Jiwa", supply: "Logistik Siaga & Dapur Umum", status: "Aktif" },
                                { Shelter: "Tenda Darurat Lapangan Kecamatan Klampok", capacity: "Kapasitas 500 Jiwa", supply: "Medis & Logistik Lengkap", status: "Aktif" },
                                { Shelter: "Masjid Baitul Makmur, Sleman", capacity: "Kapasitas 150 Jiwa", supply: "Logistik Darurat Mandiri", status: "Siaga" },
                            ].map((shelter) => (
                                <div key={shelter.Shelter} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800">{shelter.Shelter}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{shelter.capacity} | Suplai: <span className="text-cyan-600 font-semibold">{shelter.supply}</span></p>
                                    </div>
                                    <Badge className="bg-cyan-50 border border-cyan-200 text-cyan-700 text-[10px] font-semibold">{shelter.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white text-slate-800 shadow-sm flex flex-col justify-between">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-base text-slate-800 font-bold">Prosedur Operasi Standar (SOP)</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4 text-xs leading-relaxed text-slate-600">
                            <p>
                                Panduan tindakan kedaruratan bagi masyarakat lereng apabila terdengar bunyi sirene EWS terus menerus:
                            </p>
                            <ol className="list-decimal pl-4 space-y-2 text-slate-700">
                                <li>Matikan kompor, listrik, dan bawa dokumen penting.</li>
                                <li>Ikuti marka rambu evakuasi hijau menuju titik kumpul terdekat.</li>
                                <li>Segera lapor kepada petugas posko untuk pendataan keluarga.</li>
                                <li>Respon cepat evakuasi diupayakan di bawah 20 menit sejak alarm berbunyi.</li>
                            </ol>
                            <div className="p-3 bg-slate-50 border border-cyan-100 rounded-xl flex items-center gap-2 text-cyan-700 text-xs font-semibold mt-1">
                                <ShieldCheck className="h-5 w-5 text-cyan-600" />
                                Teruji: 3 Kali Simulasi Evakuasi Sukses
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
