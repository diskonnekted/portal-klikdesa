"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Shield } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

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
        | "humidity";
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
}

// Dynamically import Leaflet
const loadLeaflet = async () => {
    const L = await import("leaflet");
    return L;
};

// Dynamically import Leaflet components with explicit types
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
) as React.ComponentType<any>;

const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
) as React.ComponentType<any>;

const GeoJSON = dynamic(
    () => import("react-leaflet").then((mod) => mod.GeoJSON),
    { ssr: false }
) as React.ComponentType<any>;

const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
) as React.ComponentType<any>;

const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
) as React.ComponentType<any>;

export function LeafletMap({ sensors, geoJsonData, center, onSensorClick }: LeafletMapProps) {
    const [leafletLoaded, setLeafletLoaded] = React.useState(false);
    const [leaflet, setLeaflet] = React.useState<unknown>(null);
    const [zoomLevel, setZoomLevel] = React.useState(14);
    const [mapKey, setMapKey] = React.useState(0);
    const [componentsReady, setComponentsReady] = React.useState(false);
    const mapRef = React.useRef<HTMLDivElement>(null);

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

    // Cleanup and remount effect
    React.useEffect(() => {
        return () => {
            // Force remount when component unmounts
            setMapKey((prev) => prev + 1);
        };
    }, []);

    // Ensure proper cleanup on unmount
    React.useEffect(() => {
        return () => {
            // Clean up any existing map instances
            if (mapRef.current && mapRef.current.children.length > 0) {
                mapRef.current.innerHTML = "";
            }
        };
    }, []);

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

    const getTypeColor = (type: IoTSensor["type"]) => {
        switch (type) {
            case "seismic":
                return "bg-red-100 text-red-800";
            case "water-level":
                return "bg-blue-100 text-blue-800";
            case "rainfall":
                return "bg-sky-100 text-sky-800";
            case "weather":
            case "temperature":
                return "bg-orange-100 text-orange-800";
            case "air-quality":
                return "bg-purple-100 text-purple-800";
            case "ground-tilt":
                return "bg-amber-100 text-amber-800";
            case "wind":
                return "bg-cyan-100 text-cyan-800";
            case "voltage":
                return "bg-violet-100 text-violet-800";
            case "current":
                return "bg-sky-100 text-sky-800";
            case "power":
                return "bg-amber-100 text-amber-800";
            case "energy":
                return "bg-emerald-100 text-emerald-800";
            case "cost":
                return "bg-red-100 text-red-800";
            case "humidity":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const createCustomIcon = (color: string) => {
        if (!leaflet) return null;

        // @ts-expect-error - Leaflet runtime types mismatch
        return leaflet.divIcon({
            className: "custom-marker",
            html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
                     <div style="transform: rotate(45deg); color: white;">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-10-5z"/>
                       </svg>
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
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Village Boundary from GeoJSON */}
                    {geoJsonData && (
                        <ErrorBoundary
                            fallback={null}
                            onError={(error) => console.error("Error rendering GeoJSON:", error)}
                        >
                            <GeoJSON
                                data={geoJsonData as import("geojson").GeoJsonObject}
                                style={{
                                    color: "#0ea5e9",
                                    weight: 2,
                                    opacity: 0.8,
                                    fillColor: "#0ea5e9",
                                    fillOpacity: 0.1,
                                }}
                            />
                        </ErrorBoundary>
                    )}

                    {/* IoT Sensor Markers */}
                    {leaflet && (
                        <ErrorBoundary
                            fallback={null}
                            onError={(error) => console.error("Error rendering sensor markers:", error)}
                        >
                            {sensors.map((sensor) => {
                                const iconColor = getIconColor(sensor.type);
                                const customIcon = createCustomIcon(iconColor);

                                if (!customIcon) return null;

                                return (
                                    <Marker
                                        key={sensor.id}
                                        position={[sensor.lat, sensor.lng]}
                                        icon={customIcon}
                                    >
                                        <Popup>
                                            <div className="p-2">
                                                <h3 className="font-bold text-lg mb-2">{sensor.name}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{sensor.location}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-bold text-primary">
                                                        {sensor.value} {sensor.unit}
                                                    </span>
                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                        {sensor.id}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${getStatusColor(sensor.status)}`}
                                                    ></div>
                                                    <span className="text-sm capitalize">
                                                        {sensor.status === "active"
                                                            ? "Aktif"
                                                            : sensor.status === "warning"
                                                              ? "Peringatan"
                                                              : sensor.status === "critical"
                                                                ? "Kritis"
                                                                : "Tidak Aktif"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </ErrorBoundary>
                    )}
                </MapContainer>
            </ErrorBoundary>
        </div>
    );
}
