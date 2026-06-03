"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Shield } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

import type { GeoJSONProps, MapContainerProps, MarkerProps, PopupProps, TileLayerProps } from "react-leaflet";

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
    channel_id?: number;
    entry_id?: number;
}

interface LeafletMapProps {
    sensors: IoTSensor[];
    geoJsonData: unknown;
    center: [number, number];
    onSensorClick: (sensor: IoTSensor) => void;
    onFeatureClick?: (feature: any) => void;
    digitalStatusMap?: Record<string, boolean>;
    activeMapLayer?: "digital" | "stunting" | "kemiskinan" | "penduduk" | "pkk" | "kb" | "kesejahteraan";
    kecamatanGeoJsonData?: unknown;
    pkkData?: any[];
    kbData?: any[];
    kesejahteraanData?: any[];
}

// Dynamically import Leaflet
const loadLeaflet = async () => {
    const L = await import("leaflet");
    return L;
};

// Helper for normalizing Kecamatan names to match different spelling standards
const normalizeKecamatanName = (s: string) => {
    if (!s) return "";
    let n = s.replace(/kecamatan/i, '').replace(/kec\./i, '').replace(/[^a-z0-9]/gi, '').toUpperCase();
    if (n === 'PURWOREJAKLAMPOK' || n === 'PURWAREJAKLAMPOK') return 'PURWAREJAKLAMPOK';
    return n;
};

// Dynamically import Leaflet components with explicit types
const MapContainer = dynamic(
    () =>
        import("react-leaflet").then(
            (mod) => mod.MapContainer as unknown as React.ComponentType<MapContainerProps>
        ),
    { ssr: false }
);

const TileLayer = dynamic(
    () =>
        import("react-leaflet").then((mod) => mod.TileLayer as unknown as React.ComponentType<TileLayerProps>),
    { ssr: false }
);

const GeoJSON = dynamic(
    () =>
        import("react-leaflet").then((mod) => mod.GeoJSON as unknown as React.ComponentType<GeoJSONProps>),
    { ssr: false }
);

const Marker = dynamic(
    () =>
        import("react-leaflet").then((mod) => mod.Marker as unknown as React.ComponentType<MarkerProps>),
    { ssr: false }
);

const Popup = dynamic(
    () =>
        import("react-leaflet").then((mod) => mod.Popup as unknown as React.ComponentType<PopupProps>),
    { ssr: false }
);

const RecenterHelper = ({ useMap, center, zoom }: { useMap: any; center: [number, number]; zoom: number }) => {
    const map = useMap();
    React.useEffect(() => {
        if (map) {
            try {
                map.setView(center, zoom);
            } catch (error) {
                console.warn("Leaflet map setView skipped during unmount/remount");
            }
        }
    }, [center, zoom, map]);
    return null;
};

export function LeafletMap({ sensors, geoJsonData, center, onSensorClick, onFeatureClick, digitalStatusMap, activeMapLayer = "digital", kecamatanGeoJsonData, pkkData, kbData, kesejahteraanData }: LeafletMapProps) {
    const [leafletLoaded, setLeafletLoaded] = React.useState(false);
    const [leaflet, setLeaflet] = React.useState<typeof import("leaflet") | null>(null);
    const [zoomLevel, setZoomLevel] = React.useState(14);
    
    // Add a ref to the GeoJSON layer to update styles without remounting
    const geoJsonRef = React.useRef<any>(null);
    const [mapKey, setMapKey] = React.useState(0);
    const [componentsReady, setComponentsReady] = React.useState(false);
    const mapRef = React.useRef<HTMLDivElement>(null);
    const [useMapHook, setUseMapHook] = React.useState<any>(null);
    
    // Style function extracted to be reusable
    const getFeatureStyle = React.useCallback((feature: any) => {
        const villageName = feature?.properties?.Nama_Desa_ || feature?.properties?.name || "Desa";
        const kecName = feature?.properties?.Kecamatan || "";
        
        const cleanKec = kecName.replace(/kecamatan/i, '').replace(/kec\./i, '').trim().toUpperCase();
        const cleanDesa = villageName.toUpperCase();
        const keyName = cleanDesa + "_" + cleanKec;
    
        let isDigital = false;
        if (digitalStatusMap && digitalStatusMap[keyName] !== undefined) {
            isDigital = digitalStatusMap[keyName];
        } else {
            let hash = 0;
            for (let i = 0; i < keyName.length; i++) {
                hash = keyName.charCodeAt(i) + ((hash << 5) - hash);
            }
            isDigital = Math.abs(hash) % 100 < 65;
        }
        
        let hash = 0;
        for (let i = 0; i < keyName.length; i++) {
            hash = keyName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const stunting = (Math.abs(hash) % 15) + 5;
        const kemiskinan = (Math.abs(hash) % 25) + 10;
        
        let fillColor = "#facc15";
        let color = "#eab308";
        
        if (activeMapLayer === "digital") {
            fillColor = isDigital ? "#3b82f6" : "#facc15";
            color = isDigital ? "#0ea5e9" : "#eab308";
        } else if (activeMapLayer === "stunting") {
            fillColor = stunting > 15 ? "#ef4444" : stunting > 10 ? "#f97316" : "#22c55e";
            color = stunting > 15 ? "#b91c1c" : stunting > 10 ? "#c2410c" : "#15803d";
        } else if (activeMapLayer === "kemiskinan") {
            fillColor = kemiskinan > 30 ? "#9333ea" : kemiskinan > 20 ? "#c084fc" : "#cbd5e1";
            color = kemiskinan > 30 ? "#7e22ce" : kemiskinan > 20 ? "#9333ea" : "#94a3b8";
        }

        return {
            color: color,
            weight: 1.5,
            opacity: 0.9,
            fillColor: fillColor,
            fillOpacity: 0.55,
        };
    }, [digitalStatusMap, activeMapLayer]);

    // Style function for Kecamatan (PKK)
    const getKecamatanStyle = React.useCallback((feature: any) => {
        const kecName = feature?.properties?.Kecamatan || "";
        
        let fillColor = "#cbd5e1"; // default gray
        let color = "#94a3b8";
        
        if (activeMapLayer === "pkk" && pkkData) {
            // Find data for this kecamatan
            const norm = normalizeKecamatanName;
            const dataRow = pkkData.find((d: any) => norm(d.Kecamatan) === norm(kecName));
            
            if (dataRow) {
                const totalHomeInd = parseInt(dataRow["Jumlah Percontohan Home Industri"] || "0");
                
                // Color scale based on Home Industri (higher = darker blue/indigo)
                if (totalHomeInd > 2000) fillColor = "#4f46e5"; // indigo-600
                else if (totalHomeInd > 1500) fillColor = "#6366f1"; // indigo-500
                else if (totalHomeInd > 1000) fillColor = "#818cf8"; // indigo-400
                else if (totalHomeInd > 500) fillColor = "#a5b4fc"; // indigo-300
                else fillColor = "#c7d2fe"; // indigo-200
                
                color = "#4338ca"; // border
            }
        } else if (activeMapLayer === "kb" && kbData) {
            // Find data for this kecamatan
            const norm = normalizeKecamatanName;
            const dataRow = kbData.find((d: any) => norm(d.Kecamatan) === norm(kecName));
            
            if (dataRow) {
                const totalAktif = parseInt(dataRow.Aktif || "0");
                
                // Color scale based on KB Aktif (higher = darker pink)
                if (totalAktif > 8000) fillColor = "#db2777"; // pink-600
                else if (totalAktif > 5000) fillColor = "#ec4899"; // pink-500
                else if (totalAktif > 3000) fillColor = "#f472b6"; // pink-400
                else if (totalAktif > 1000) fillColor = "#f9a8d4"; // pink-300
                else fillColor = "#fbcfe8"; // pink-200
                
                color = "#be185d"; // border
            }
        } else if (activeMapLayer === "kesejahteraan" && kesejahteraanData) {
            // Find data for this kecamatan
            const norm = normalizeKecamatanName;
            const dataRow = kesejahteraanData.find((d: any) => norm(d.Kecamatan) === norm(kecName));
            
            if (dataRow) {
                const totalSangatMiskin = parseInt(dataRow["Status Kesejahteraan 1"] || "0");
                
                // Color scale based on Desil 1 (higher = darker orange)
                if (totalSangatMiskin > 15000) fillColor = "#c2410c"; // orange-700
                else if (totalSangatMiskin > 10000) fillColor = "#ea580c"; // orange-600
                else if (totalSangatMiskin > 8000) fillColor = "#f97316"; // orange-500
                else if (totalSangatMiskin > 5000) fillColor = "#fb923c"; // orange-400
                else fillColor = "#fdba74"; // orange-300
                
                color = "#9a3412"; // border
            }
        }
        
        return {
            color: color,
            weight: 2,
            opacity: 0.9,
            fillColor: fillColor,
            fillOpacity: 0.7,
        };
    }, [pkkData, activeMapLayer]);

    // Apply styles dynamically without unmounting the component
    React.useEffect(() => {
        if (geoJsonRef.current && geoJsonRef.current.setStyle) {
            geoJsonRef.current.setStyle(getFeatureStyle);
        }
    }, [activeMapLayer, getFeatureStyle]);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            import("react-leaflet").then((mod) => {
                setUseMapHook(() => mod.useMap);
            });
        }
    }, []);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            loadLeaflet().then((L) => {
                // Fix for default markers in Leaflet with Next.js
                // @ts-expect-error - Leaflet runtime prototype includes _getIconUrl not declared in types
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                });
                setLeaflet(L);
                setLeafletLoaded(true);
            });
        }
    }, []);

    // Ensure all dynamic components are loaded before rendering
    React.useEffect(() => {
        if (leafletLoaded && typeof window !== "undefined") {
            // Small delay to ensure all dynamic imports are fully loaded
            const timer = setTimeout(() => {
                setComponentsReady(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [leafletLoaded]);

    React.useEffect(() => {
        // Update zoom level based on screen size
        const updateZoom = () => {
            const isDesktop = window.innerWidth >= 1024; // lg breakpoint
            setZoomLevel(isDesktop ? 15 : 14);
        };

        // Set initial zoom
        updateZoom();

        // Listen for resize events
        window.addEventListener("resize", updateZoom);

        return () => {
            window.removeEventListener("resize", updateZoom);
        };
    }, []);

    // Let react-leaflet handle its own cleanup internally

    const getIconColor = (type: IoTSensor["type"]) => {
        switch (type) {
            case "seismic":
                return "#ef4444";
            case "water-level":
                return "#3b82f6";
            case "rainfall":
                return "#0ea5e9";
            case "weather":
            case "temperature":
                return "#f97316";
            case "air-quality":
                return "#a855f7";
            case "ground-tilt":
                return "#f59e0b";
            case "wind":
                return "#06b6d4";
            case "voltage":
                return "#8b5cf6";
            case "current":
                return "#06b6d4";
            case "power":
                return "#f59e0b";
            case "energy":
                return "#10b981";
            case "cost":
                return "#ef4444";
            case "humidity":
                return "#3b82f6";
            case "cctv":
                return "#0891b2"; // cyan-darker / teal
            default:
                return "#6b7280";
        }
    };

    const getStatusColor = (status: IoTSensor["status"]) => {
        switch (status) {
            case "active":
                return "bg-green-500";
            case "warning":
                return "bg-amber-500";
            case "critical":
                return "bg-red-500";
            case "inactive":
                return "bg-gray-400";
            default:
                return "bg-gray-400";
        }
    };

    const createCustomIcon = (color: string, type: string) => {
        if (!leaflet) return null;

        const isCctv = type === "cctv";
        const svgContent = isCctv 
            ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                 <circle cx="12" cy="13" r="4"/>
               </svg>`
            : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-10-5z"/>
               </svg>`;

        return leaflet.divIcon({
            className: "custom-marker",
            html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
                     <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
                       ${svgContent}
                     </div>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        });
    };

    if (!leafletLoaded || !componentsReady) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Memuat peta...</p>
                </div>
            </div>
        );
    }

    return (
        <div key={mapKey} ref={mapRef} className="w-full h-full">
            <ErrorBoundary
                fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center text-red-600">
                            <Shield className="h-12 w-12 mx-auto mb-2" />
                            <p>Error rendering map</p>
                            <button
                                onClick={() => setMapKey((prev) => prev + 1)}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                }
                onError={(error) => console.error("Map rendering error:", error)}
            >
                <MapContainer
                    center={center}
                    zoom={zoomLevel}
                    style={{ height: "100%", width: "100%", zIndex: 1 }}
                    zoomControl={true}
                    className="leaflet-map-container"
                >
                    {useMapHook && <RecenterHelper useMap={useMapHook} center={center} zoom={zoomLevel} />}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Boundary layers conditionally rendered based on active map layer */}
                    {activeMapLayer === "pkk" && kecamatanGeoJsonData ? (
                        <ErrorBoundary
                            fallback={null}
                            onError={(error) => console.error("Error rendering Kecamatan GeoJSON:", error)}
                        >
                            {(() => {
                                const AnyGeoJSON = GeoJSON as any;
                                return (
                                    <AnyGeoJSON
                                        key="pkk-layer"
                                        data={kecamatanGeoJsonData as import("geojson").GeoJsonObject}
                                        style={getKecamatanStyle}
                                        onEachFeature={(feature: any, layer: any) => {
                                            const kec = feature?.properties?.Kecamatan || "";
                                            let tooltipContent = `<b>Kecamatan ${kec}</b>`;
                                            
                                            if (pkkData) {
                                                const norm = normalizeKecamatanName;
                                                const dataRow = pkkData.find((d: any) => norm(d.Kecamatan) === norm(kec));
                                                if (dataRow) {
                                                    tooltipContent += `<br/><span style="font-size:10px;">Home Industri: ${dataRow["Jumlah Percontohan Home Industri"]}</span>`;
                                                    tooltipContent += `<br/><span style="font-size:10px;">Rumah Sehat: ${dataRow["Jumlah Percontohan Rumah Sehat"]}</span>`;
                                                }
                                            }
                                            
                                            layer.bindTooltip(tooltipContent);
                                            
                                            if (onFeatureClick) {
                                                layer.on({
                                                    click: () => {
                                                        // Pass the pkkData row along with the feature
                                                        const norm = normalizeKecamatanName;
                                                        const dataRow = pkkData ? pkkData.find((d: any) => norm(d.Kecamatan) === norm(kec)) : null;
                                                        onFeatureClick({ ...feature, isKecamatanLayer: true, pkkData: dataRow });
                                                    }
                                                });
                                            }
                                        }}
                                    />
                                );
                            })()}
                        </ErrorBoundary>
                    ) : activeMapLayer === "kb" && kecamatanGeoJsonData ? (
                        <ErrorBoundary
                            fallback={null}
                            onError={(error) => console.error("Error rendering Kecamatan GeoJSON (KB):", error)}
                        >
                            {(() => {
                                const AnyGeoJSON = GeoJSON as any;
                                return (
                                    <AnyGeoJSON
                                        key="kb-layer"
                                        data={kecamatanGeoJsonData as import("geojson").GeoJsonObject}
                                        style={getKecamatanStyle}
                                        onEachFeature={(feature: any, layer: any) => {
                                            const kec = feature?.properties?.Kecamatan || "";
                                            let tooltipContent = `<b>Kecamatan ${kec}</b>`;
                                            
                                            if (kbData) {
                                                const norm = normalizeKecamatanName;
                                                const dataRow = kbData.find((d: any) => norm(d.Kecamatan) === norm(kec));
                                                if (dataRow) {
                                                    tooltipContent += `<br/><span style="font-size:10px;">Akseptor Baru: ${dataRow.Baru}</span>`;
                                                    tooltipContent += `<br/><span style="font-size:10px;">Akseptor Aktif: ${dataRow.Aktif}</span>`;
                                                }
                                            }
                                            
                                            layer.bindTooltip(tooltipContent);
                                            
                                            if (onFeatureClick) {
                                                layer.on({
                                                    click: () => {
                                                        const norm = normalizeKecamatanName;
                                                        const dataRow = kbData ? kbData.find((d: any) => norm(d.Kecamatan) === norm(kec)) : null;
                                                        onFeatureClick({ ...feature, isKecamatanLayer: true, kbData: dataRow });
                                                    }
                                                });
                                            }
                                        }}
                                    />
                                );
                            })()}
                        </ErrorBoundary>
                    ) : activeMapLayer === "kesejahteraan" && kecamatanGeoJsonData ? (
                        <ErrorBoundary
                            fallback={null}
                            onError={(error) => console.error("Error rendering Kecamatan GeoJSON (Kesejahteraan):", error)}
                        >
                            {(() => {
                                const AnyGeoJSON = GeoJSON as any;
                                return (
                                    <AnyGeoJSON
                                        key="kesejahteraan-layer"
                                        data={kecamatanGeoJsonData as import("geojson").GeoJsonObject}
                                        style={getKecamatanStyle}
                                        onEachFeature={(feature: any, layer: any) => {
                                            const kec = feature?.properties?.Kecamatan || "";
                                            let tooltipContent = `<b>Kecamatan ${kec}</b>`;
                                            
                                            if (kesejahteraanData) {
                                                const norm = normalizeKecamatanName;
                                                const dataRow = kesejahteraanData.find((d: any) => norm(d.Kecamatan) === norm(kec));
                                                if (dataRow) {
                                                    tooltipContent += `<br/><span style="font-size:10px;">Desil 1: ${dataRow["Status Kesejahteraan 1"]}</span>`;
                                                    tooltipContent += `<br/><span style="font-size:10px;">Desil 2: ${dataRow["Status Kesejahteraan 2"]}</span>`;
                                                }
                                            }
                                            
                                            layer.bindTooltip(tooltipContent);
                                            
                                            if (onFeatureClick) {
                                                layer.on({
                                                    click: () => {
                                                        const norm = normalizeKecamatanName;
                                                        const dataRow = kesejahteraanData ? kesejahteraanData.find((d: any) => norm(d.Kecamatan) === norm(kec)) : null;
                                                        onFeatureClick({ ...feature, isKecamatanLayer: true, kesejahteraanData: dataRow });
                                                    }
                                                });
                                            }
                                        }}
                                    />
                                );
                            })()}
                        </ErrorBoundary>
                    ) : geoJsonData != null && digitalStatusMap && Object.keys(digitalStatusMap).length > 0 ? (
                        <ErrorBoundary
                            fallback={null}
                            onError={(error) => console.error("Error rendering GeoJSON:", error)}
                        >
                            {/* Use a casted component to bypass TypeScript error about 'ref' not existing on GeoJSONProps */}
                            {(() => {
                                const AnyGeoJSON = GeoJSON as any;
                                return (
                                    <AnyGeoJSON
                                        key="desa-layer"
                                        ref={geoJsonRef}
                                        data={geoJsonData as import("geojson").GeoJsonObject}
                                        style={getFeatureStyle}
                                        onEachFeature={(feature: any, layer: any) => {
                                            const villageName = feature?.properties?.Nama_Desa_ || feature?.properties?.name || "Desa";
                                            const kec = feature?.properties?.Kecamatan || "";
                                            layer.bindTooltip(`<b>${villageName}</b><br/><span style="font-size:10px;color:gray;">${kec}</span>`);
                                            
                                            if (onFeatureClick) {
                                                layer.on({
                                                    click: () => {
                                                        onFeatureClick(feature);
                                                    }
                                                });
                                            }
                                        }}
                                    />
                                );
                            })()}
                        </ErrorBoundary>
                    ) : null}

                    {/* IoT Sensor Markers */}
                    {leaflet ? (
                        <ErrorBoundary
                            fallback={null}
                            onError={(error) => console.error("Error rendering sensor markers:", error)}
                        >
                            {sensors.map((sensor) => {
                                const iconColor = getIconColor(sensor.type);
                                const customIcon = createCustomIcon(iconColor, sensor.type);

                                if (!customIcon) return null;

                                return (
                                    <Marker
                                        key={sensor.id}
                                        position={[sensor.lat, sensor.lng]}
                                        icon={customIcon}
                                        eventHandlers={{ click: () => onSensorClick(sensor) }}
                                    >
                                        <Popup>
                                            <div className="p-2 min-w-[200px]">
                                                <h3 className="font-bold text-sm text-slate-800 mb-0.5">{sensor.name}</h3>
                                                <p className="text-[10px] text-gray-500 mb-1.5">{sensor.location}</p>
                                                
                                                {sensor.type === "cctv" ? (
                                                    <div className="space-y-1.5">
                                                        <div className="aspect-video w-full rounded overflow-hidden bg-black relative">
                                                            <video 
                                                                src={`/images/${sensor.id.toLowerCase()}.mp4`}
                                                                className="w-full h-full object-cover"
                                                                autoPlay
                                                                loop
                                                                muted
                                                                playsInline
                                                            />
                                                            <div className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase">
                                                                LIVE
                                                            </div>
                                                        </div>
                                                        <a 
                                                            href="#cctv" 
                                                            className="block w-full text-center text-[10px] bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1 rounded transition"
                                                        >
                                                            Lihat Detail Pantauan
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xl font-bold text-slate-850">
                                                                {sensor.value} {sensor.unit}
                                                            </span>
                                                            <span className="text-[10px] bg-gray-150 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                                                                {sensor.id}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1.5 flex items-center gap-1.5">
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${getStatusColor(sensor.status)}`}
                                                            ></div>
                                                            <span className="text-xs text-gray-600 capitalize">
                                                                {sensor.status === "active"
                                                                    ? "Aktif"
                                                                    : sensor.status === "warning"
                                                                      ? "Peringatan"
                                                                      : sensor.status === "critical"
                                                                        ? "Kritis"
                                                                        : "Tidak Aktif"}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </ErrorBoundary>
                    ) : null}
                </MapContainer>
            </ErrorBoundary>
        </div>
    );
}
