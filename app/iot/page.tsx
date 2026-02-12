"use client";

import * as React from "react";
import {
    Activity,
    Thermometer,
    Droplet,
    CloudRain,
    Shield,
    Radio,
    MapPin,
    ChevronDown,
    BarChart3,
    TrendingUp,
    ChevronUp,
} from "lucide-react";
import { LeafletMap } from "@/components/ui/custom/LeafletMap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatIoTTimestamp } from "@/lib/dateUtils";
import { formatLastSeen } from "@/lib/thingspeak";
import { SIJENGGUNG_CENTER } from "@/lib/mapUtils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    value: number;
    unit: string;
    description: string;
}

interface IoTDevice {
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    status: "active" | "inactive" | "warning" | "critical";
    battery: number;
    description: string;
    location: string;
    lastUpdate: string;
    channel_id?: number;
    entry_id?: number;
    sensors: IoTSensor[];
    historicalData?: HistoricalDataEntry[];
}

interface HistoricalDataEntry {
    timestamp: string;
    entry_id: number;
    [key: string]: string | number; // Dynamic sensor values
}

// Helper function to get status color
const getStatusColor = (status: IoTDevice["status"]) => {
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

// Icon color function removed - kept for future use if needed
// const getIconColor = (type: IoTSensor["type"]) => { ... }

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

const getSensorIcon = (type: IoTSensor["type"]) => {
    switch (type) {
        case "seismic":
            return <Activity className="h-5 w-5" />;
        case "water-level":
            return <Droplet className="h-5 w-5" />;
        case "rainfall":
            return <CloudRain className="h-5 w-5" />;
        case "weather":
        case "temperature":
        case "voltage":
        case "current":
        case "power":
        case "energy":
        case "cost":
            return <Thermometer className="h-5 w-5" />;
        case "air-quality":
            return <Shield className="h-5 w-5" />;
        case "ground-tilt":
            return <Activity className="h-5 w-5" />;
        case "wind":
            return <Radio className="h-5 w-5" />;
        case "humidity":
            return <Droplet className="h-5 w-5" />;
        default:
            return <MapPin className="h-5 w-5" />;
    }
};

export default function IoTPage() {
    const [devices, setDevices] = React.useState<IoTDevice[]>([]);
    const [selectedDevice, setSelectedDevice] = React.useState<IoTDevice | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [devicesLoading, setDevicesLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [channelErrors, setChannelErrors] = React.useState<{ channel: string; error: Error }[]>([]);
    const [selectedSensor, setSelectedSensor] = React.useState<IoTSensor | null>(null);
    const [geoJsonData, setGeoJsonData] = React.useState<GeoJSON.FeatureCollection | null>(null);
    const [mapLoaded, setMapLoaded] = React.useState(false);
    const mapCenter: [number, number] = [SIJENGGUNG_CENTER.lat, SIJENGGUNG_CENTER.lng];
    const [newEntryIds, setNewEntryIds] = React.useState<Set<number>>(new Set());
    const [mapKey, setMapKey] = React.useState(0);

    // Charts state
    const [showCharts, setShowCharts] = React.useState(false);
    const [chartsData, setChartsData] = React.useState<Array<{ timestamp: string; [key: string]: number | string }>>([]);
    const [chartsLoading, setChartsLoading] = React.useState(false);
    const [chartsError, setChartsError] = React.useState<string | null>(null);
    const [timeRange, setTimeRange] = React.useState<"1h" | "6h" | "24h" | "7d" | "30d" | "all">("6h");
    const [visibleSensors, setVisibleSensors] = React.useState<Set<string>>(new Set());

    // Pagination state for historical data
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isMobile, setIsMobile] = React.useState(false);

    // Detect mobile viewport
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Reset map key when page becomes visible again (fixes navigation issues)
    React.useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                setMapKey((prev) => prev + 1);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    React.useEffect(() => {
        // Load GeoJSON data
        fetch("/uploads/peta/SIJENGGUNG.geojson")
            .then((res) => res.json())
            .then((data) => {
                setGeoJsonData(data);
                setMapLoaded(true);
            })
            .catch((err) => {
                console.error("Failed to load GeoJSON:", err);
                setMapLoaded(true);
            });

        // Setup Server-Sent Events connection for real-time updates
        const setupEventSource = () => {
            const sseUrl = `/api/iot/stream`;
            const eventSource = new EventSource(sseUrl);

            eventSource.onopen = () => {
                console.log("EventSource connected for real-time IoT data");
                setLoading(false);
            };

            eventSource.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    if (message.type === "iot-update") {
                        const data = message.data;
                        const deviceList = data.devices || [];
                        const errors = data.errors || [];

                        // Update channel errors if any
                        setChannelErrors(errors);

                        // Detect new entries if we have a selected device
                        if (selectedDevice) {
                            const updatedDevice = deviceList.find((d: IoTDevice) => d.id === selectedDevice.id);
                            if (updatedDevice && updatedDevice.historicalData) {
                                const oldEntryIds = new Set(
                                    selectedDevice.historicalData?.map(
                                        (entry: HistoricalDataEntry) => entry.entry_id
                                    ) || []
                                );
                                const newEntries = updatedDevice.historicalData.filter(
                                    (entry: HistoricalDataEntry) => !oldEntryIds.has(entry.entry_id)
                                );

                                if (newEntries.length > 0) {
                                    const newIds = new Set<number>(
                                        newEntries.map((entry: HistoricalDataEntry) => entry.entry_id)
                                    );
                                    setNewEntryIds(newIds);

                                    // Auto-remove the "new" highlight after 5 seconds
                                    setTimeout(() => {
                                        setNewEntryIds(new Set<number>());
                                    }, 5000);
                                }

                                setSelectedDevice(updatedDevice);
                            }
                        } else if (deviceList.length > 0) {
                            // Select first device by default if none selected
                            setSelectedDevice(deviceList[0]);
                        }

                        // Update devices
                        setDevices(deviceList);
                        setDevicesLoading(false);

                        // Clear main error if we got at least some data
                        if (deviceList.length > 0) {
                            setError(null);
                        }
                        setLoading(false);
                    } else if (message.type === "error") {
                        console.error("SSE error:", message.message);
                        setError(message.message || "Failed to fetch IoT data from all channels");
                        setDevicesLoading(false);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Error parsing SSE message:", error);
                }
            };

            eventSource.onerror = (error) => {
                console.error("EventSource error:", error);
                // EventSource automatically reconnects, but we can handle the error
                if (eventSource.readyState === EventSource.CLOSED) {
                    setError("Real-time connection lost. Attempting to reconnect...");
                    setLoading(true);
                }
            };

            return eventSource;
        };

        // Initialize EventSource connection
        const eventSource = setupEventSource();

        // Cleanup function
        return () => {
            eventSource.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDevice?.id]);

    // Reset pagination when device changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedDevice]);

    const totalSensors = devices.reduce((acc, d) => acc + d.sensors.length, 0);
    const activeDevices = devices.filter((d) => d.status === "active").length;
    const warningDevices = devices.filter((d) => d.status === "warning").length;
    const criticalDevices = devices.filter((d) => d.status === "critical").length;

    // Calculate pagination for historical data
    const desktopItemsPerPage = 20;
    const itemsPerPage = isMobile ? 10 : desktopItemsPerPage;
    const totalItems = selectedDevice?.historicalData?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = selectedDevice?.historicalData?.slice(startIndex, endIndex) || [];

    // Function to fetch historical chart data
    const fetchChartsData = React.useCallback(async () => {
        if (!selectedDevice?.channel_id) return;

        setChartsLoading(true);
        setChartsError(null);

        try {
            const response = await fetch(`/api/iot/historical/${selectedDevice.channel_id}?results=8000`);

            if (!response.ok) {
                throw new Error(`Failed to fetch chart data: ${response.status}`);
            }

            const data = await response.json();
            setChartsData(data.data || []);

            // Initialize all sensors as visible
            if (data.sensors) {
                setVisibleSensors(new Set(data.sensors.map((s: { name: string }) => s.name)));
            }
        } catch (error) {
            console.error("Error fetching charts data:", error);
            setChartsError(error instanceof Error ? error.message : "Failed to load chart data");
        } finally {
            setChartsLoading(false);
        }
    }, [selectedDevice?.channel_id]);

    // Load charts data when charts section is opened
    React.useEffect(() => {
        if (showCharts && chartsData.length === 0) {
            fetchChartsData();
        }
    }, [showCharts, chartsData.length, fetchChartsData]);

    // Filter and process chart data by time range (reversed for chronological order)
    const filteredChartsData = React.useMemo(() => {
        if (!chartsData.length) return [];

        const now = new Date();
        const cutoffTimes: Record<typeof timeRange, number> = {
            "1h": 1 * 60 * 60 * 1000,
            "6h": 6 * 60 * 60 * 1000,
            "24h": 24 * 60 * 60 * 1000,
            "7d": 7 * 24 * 60 * 60 * 1000,
            "30d": 30 * 24 * 60 * 60 * 1000,
            all: Infinity,
        };

        const cutoff = now.getTime() - cutoffTimes[timeRange];

        // Filter by time range and reverse to show chronological order (oldest to newest)
        return chartsData
            .filter((entry) => {
                const entryTime = new Date(entry.timestamp).getTime();
                return entryTime >= cutoff;
            })
            .reverse() // Reverse to show chronological order (oldest first, newest last)
            .map((entry) => ({
                ...entry,
                // Add formatted timestamp for consistent display
                formattedTimestamp: formatIoTTimestamp(entry.timestamp),
                // Add display time for chart tooltips
                displayTime: new Date(entry.timestamp).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
            }));
    }, [chartsData, timeRange]);

    // Toggle sensor visibility
    const toggleSensor = (sensorName: string) => {
        setVisibleSensors((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(sensorName)) {
                newSet.delete(sensorName);
            } else {
                newSet.add(sensorName);
            }
            return newSet;
        });
    };

    // Colors for chart lines
    const chartColors = [
        "#3b82f6", // blue
        "#ef4444", // red
        "#10b981", // green
        "#f59e0b", // amber
        "#8b5cf6", // purple
        "#ec4899", // pink
        "#06b6d4", // cyan
        "#f97316", // orange
    ];

    // Helper function for pagination numbers (similar to berita page)
    function getIoTPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage === 1) {
            return [currentPage, currentPage + 1, currentPage + 2, "...", totalPages];
        }

        if (currentPage === 2) {
            return [currentPage - 1, currentPage, currentPage + 1, currentPage + 2, "...", totalPages];
        }

        if (currentPage === 3) {
            return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, "...", totalPages];
        }

        if (currentPage >= 4 && currentPage <= totalPages - 3) {
            return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
        }

        if (currentPage === totalPages - 2) {
            return [1, "...", currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
        }

        if (currentPage === totalPages - 1) {
            return [1, "...", currentPage - 2, currentPage - 1, currentPage, currentPage + 1];
        }

        if (currentPage === totalPages) {
            return [1, "...", currentPage - 3, currentPage - 2, currentPage - 1, currentPage];
        }

        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Page Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full">
                        <Activity className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Smart Monitoring System</h1>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Sistem Monitoring cerdas untuk Smart Office dan Environment Monitoring di Desa Sijenggung
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-gray-600">Memuat data sensor IoT...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-red-600 mb-2">
                            <Shield className="h-12 w-12 mx-auto mb-2" />
                            <h3 className="text-lg font-semibold">Gagal Memuat Data</h3>
                        </div>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* Partial Error Warning - Some channels failed */}
                {!loading && !error && channelErrors.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-amber-900 mb-1">
                                    Peringatan: Beberapa Perangkat Gagal Dimuat
                                </h3>
                                <p className="text-sm text-amber-800 mb-2">
                                    {channelErrors.length} dari {channelErrors.length + devices.length} channel gagal
                                    terhubung:
                                </p>
                                <ul className="text-xs text-amber-700 space-y-1">
                                    {channelErrors.map((err, idx) => (
                                        <li key={idx} className="font-mono">
                                            â€¢ Channel {err.channel}: {err.error?.message || "Connection failed"}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                {!loading && !error && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-linear-to-br from-green-50 to-emerald-50 border-green-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Perangkat Aktif</p>
                                        <p className="text-3xl font-bold text-green-900">{activeDevices}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-amber-50 to-yellow-50 border-amber-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-amber-800">Peringatan</p>
                                        <p className="text-3xl font-bold text-amber-900">{warningDevices}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-red-50 to-rose-50 border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-800">Kritis</p>
                                        <p className="text-3xl font-bold text-red-900">{criticalDevices}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-indigo-50 to-blue-50 border-indigo-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-indigo-800">Total Sensor</p>
                                        <p className="text-3xl font-bold text-indigo-900">{totalSensors}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Section */}
                    <div className="lg:col-span-2">
                        <Card className="h-[600px] lg:h-[700px] overflow-hidden pb-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Peta Lokasi
                                    </CardTitle>
                                    {devices.length > 0 && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm">
                                                    {selectedDevice?.name || "Pilih Perangkat"}
                                                    <ChevronDown className="h-4 w-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-64">
                                                {devices.map((device) => (
                                                    <DropdownMenuItem
                                                        key={device.id}
                                                        onClick={() => setSelectedDevice(device)}
                                                        className={cn(
                                                            "cursor-pointer flex-col items-start",
                                                            selectedDevice?.id === device.id && "bg-primary/10"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className={cn(
                                                                        "w-3 h-3 rounded-full",
                                                                        getStatusColor(device.status)
                                                                    )}
                                                                ></div>
                                                                <span className="font-medium">{device.name}</span>
                                                            </div>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {device.sensors.length} sensor
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1 w-full">
                                                            <span className="text-xs text-gray-500">
                                                                {device.status === "inactive"
                                                                    ? "âš ï¸ Offline"
                                                                    : device.status === "critical"
                                                                      ? "ðŸ”´ Critical"
                                                                      : device.status === "warning"
                                                                        ? "ðŸŸ¡ Warning"
                                                                        : "âœ… Online"}{" "}
                                                                â€¢ {formatLastSeen(device.lastUpdate)}
                                                            </span>
                                                        </div>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 h-full relative">
                                {!mapLoaded || loading ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <div className="text-center">
                                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                                            <p className="text-gray-600">Memuat peta...</p>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <div className="text-center text-red-600">
                                            <Shield className="h-12 w-12 mx-auto mb-2" />
                                            <p>Error loading map</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <LeafletMap
                                            key={mapKey}
                                            sensors={devices.map((d) => ({
                                                id: d.id,
                                                name: d.name,
                                                type: d.type as IoTSensor["type"],
                                                lat: d.lat,
                                                lng: d.lng,
                                                status: d.status,
                                                value: 0, // Device doesn't have a single value
                                                unit: "",
                                                lastUpdate: d.lastUpdate,
                                                location: d.location,
                                                battery: d.battery,
                                                description: d.description,
                                            }))}
                                            geoJsonData={geoJsonData}
                                            center={
                                                selectedDevice ? [selectedDevice.lat, selectedDevice.lng] : mapCenter
                                            }
                                            onSensorClick={() => {}} // Disabled - no modal on map click
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sensor List */}
                    <div className="space-y-4">
                        <Card className="h-[600px] lg:h-[700px]">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {selectedDevice ? `Sensor ${selectedDevice.name}` : "Daftar Sensor"}
                                </CardTitle>
                                {selectedDevice && (
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {selectedDevice.location} â€¢ {selectedDevice.sensors.length} sensor
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge
                                                className={cn(
                                                    "text-xs",
                                                    selectedDevice.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : selectedDevice.status === "warning"
                                                          ? "bg-amber-100 text-amber-800"
                                                          : selectedDevice.status === "critical"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                                )}
                                            >
                                                {selectedDevice.status === "inactive"
                                                    ? "âš ï¸ Offline"
                                                    : selectedDevice.status === "critical"
                                                      ? "ðŸ”´ Critical"
                                                      : selectedDevice.status === "warning"
                                                        ? "ðŸŸ¡ Warning"
                                                        : "âœ… Online"}
                                            </Badge>
                                            <span className="text-xs text-gray-500">
                                                Last seen: {formatLastSeen(selectedDevice.lastUpdate)}
                                            </span>
                                        </div>
                                        {selectedDevice.status !== "active" && (
                                            <p className="text-xs text-amber-600 mt-2 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                                                âš ï¸ Perangkat tidak mengirim data{" "}
                                                {formatLastSeen(selectedDevice.lastUpdate)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-3 h-[calc(100%-100px)] overflow-y-auto">
                                {devicesLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="p-3 rounded-lg border border-gray-200 animate-pulse"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                                                        </div>
                                                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="h-5 bg-gray-200 rounded w-20"></div>
                                                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : !selectedDevice ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Pilih perangkat untuk melihat sensor</p>
                                    </div>
                                ) : selectedDevice.sensors.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Tidak ada sensor di perangkat ini</p>
                                    </div>
                                ) : (
                                    selectedDevice.sensors.map((sensor) => (
                                        <div
                                            key={sensor.id}
                                            className={cn(
                                                "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                                                selectedSensor?.id === sensor.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-gray-200"
                                            )}
                                            onClick={() => setSelectedSensor(sensor)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center text-white",
                                                        getStatusColor(selectedDevice.status)
                                                    )}
                                                >
                                                    {getSensorIcon(sensor.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold text-sm truncate">
                                                            {sensor.name}
                                                        </h4>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {sensor.value} {sensor.unit}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        {selectedDevice.location}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <Badge className={cn("text-xs", getTypeColor(sensor.type))}>
                                                            {sensor.id}
                                                        </Badge>
                                                        <span className="text-xs text-gray-400">
                                                            {formatIoTTimestamp(selectedDevice.lastUpdate)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Sensor Detail Modal */}
                {selectedSensor && selectedDevice && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center text-white",
                                                getStatusColor(selectedDevice.status)
                                            )}
                                        >
                                            {getSensorIcon(selectedSensor.type)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{selectedSensor.name}</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">{selectedSensor.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Perangkat: {selectedDevice.name} ({selectedDevice.id})
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedSensor(null)}
                                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                    >
                                        Ã—
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Status Perangkat</p>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    getStatusColor(selectedDevice.status)
                                                )}
                                            ></div>
                                            <span className="font-semibold capitalize">
                                                {selectedDevice.status === "active"
                                                    ? "Aktif"
                                                    : selectedDevice.status === "warning"
                                                      ? "Peringatan"
                                                      : selectedDevice.status === "critical"
                                                        ? "Kritis"
                                                        : "Tidak Aktif"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Nilai Sensor</p>
                                        <p className="text-3xl font-bold text-foreground">
                                            {selectedSensor.value}{" "}
                                            <span className="text-lg">{selectedSensor.unit}</span>
                                        </p>
                                    </div>
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Terakhir Update</p>
                                        <p className="font-semibold">{formatIoTTimestamp(selectedDevice.lastUpdate)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold">Informasi Lokasi Perangkat</h3>
                                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600">Lokasi:</span>
                                            <span className="font-medium">{selectedDevice.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600">Koordinat:</span>
                                            <span className="font-medium">
                                                {selectedDevice.lat.toFixed(6)}, {selectedDevice.lng.toFixed(6)}
                                            </span>
                                        </div>
                                        {selectedDevice.channel_id && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Activity className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-600">Channel ID:</span>
                                                <span className="font-medium">{selectedDevice.channel_id}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Historical Data Section */}
                {!error &&
                    (devicesLoading ||
                        (selectedDevice &&
                            selectedDevice.historicalData &&
                            selectedDevice.historicalData.length > 0)) && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        {devicesLoading ? "Data Historis" : `Data Historis - ${selectedDevice?.name}`}
                                    </CardTitle>
                                    {!devicesLoading && selectedDevice && (
                                        <p className="text-sm text-gray-600">
                                            Total {totalItems} data â€¢ Menampilkan {currentData.length} data per halaman
                                        </p>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {devicesLoading ? (
                                        <div className="space-y-6">
                                            {/* Analytics Summary Skeleton */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="bg-muted/50 p-3 rounded-lg animate-pulse">
                                                        <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Table Skeleton */}
                                            <div className="border rounded-lg overflow-hidden">
                                                <div className="bg-muted/50 p-4">
                                                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                                                    <div className="space-y-2">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <div key={i} className="h-12 bg-gray-100 rounded"></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : selectedDevice ? (
                                        <div>
                                            {/* Analytics Summary */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                {selectedDevice.sensors.slice(0, 4).map((sensor) => {
                                                    const values =
                                                        selectedDevice.historicalData
                                                            ?.map((d) => d[sensor.name] as number)
                                                            .filter((v) => !isNaN(v)) || [];
                                                    const avg =
                                                        values.length > 0
                                                            ? values.reduce((a, b) => a + b, 0) / values.length
                                                            : 0;
                                                    const max = values.length > 0 ? Math.max(...values) : 0;
                                                    const min = values.length > 0 ? Math.min(...values) : 0;

                                                    return (
                                                        <div key={sensor.id} className="bg-muted/50 p-3 rounded-lg">
                                                            <p className="text-xs text-gray-600 mb-1">{sensor.name}</p>
                                                            <div className="space-y-1">
                                                                <p className="text-sm">
                                                                    <span className="text-gray-500">Avg: </span>
                                                                    <span className="font-semibold">
                                                                        {avg.toFixed(2)} {sensor.unit}
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Min: {min.toFixed(2)} | Max: {max.toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Historical Data Table */}
                                            <div className="overflow-x-auto border rounded-lg">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-muted/50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left font-semibold">
                                                                Timestamp
                                                            </th>
                                                            {selectedDevice.sensors.map((sensor) => (
                                                                <th
                                                                    key={sensor.id}
                                                                    className="px-4 py-3 text-left font-semibold"
                                                                >
                                                                    {sensor.name}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {currentData.map((entry, idx) => {
                                                            const isNew = newEntryIds.has(entry.entry_id);
                                                            return (
                                                                <tr
                                                                    key={entry.entry_id}
                                                                    className={cn(
                                                                        "transition-colors duration-1000",
                                                                        isNew
                                                                            ? "bg-green-50 animate-pulse"
                                                                            : idx % 2 === 0
                                                                              ? "bg-background"
                                                                              : "bg-muted/20"
                                                                    )}
                                                                >
                                                                    <td className="px-4 py-3 text-gray-600">
                                                                        {isNew && (
                                                                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                                                        )}
                                                                        {formatIoTTimestamp(entry.timestamp)}
                                                                    </td>
                                                                    {selectedDevice.sensors.map((sensor) => (
                                                                        <td
                                                                            key={sensor.id}
                                                                            className="px-4 py-3 font-mono"
                                                                        >
                                                                            {entry[sensor.name] !== undefined
                                                                                ? entry[sensor.name]
                                                                                : "-"}{" "}
                                                                            {sensor.unit}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            {totalPages > 1 && (
                                                <div className="mt-4">
                                                    <div className="flex items-center justify-center">
                                                        <div className="flex items-center gap-1">
                                                            {/* First Page (<<) */}
                                                            <button
                                                                onClick={() => setCurrentPage(1)}
                                                                disabled={currentPage === 1}
                                                                className="h-8 w-8 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {"\u003c\u003c"}
                                                            </button>

                                                            {/* Previous (<) */}
                                                            <button
                                                                onClick={() =>
                                                                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                                                                }
                                                                disabled={currentPage === 1}
                                                                className="h-8 w-8 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {"\u003c"}
                                                            </button>

                                                            {/* Page Numbers */}
                                                            {getIoTPageNumbers(currentPage, totalPages).map(
                                                                (pageNum: number | "...", index: number) => (
                                                                    <span key={index}>
                                                                        {pageNum === "..." ? (
                                                                            <span className="px-3 py-2 sm:px-2 text-sm">
                                                                                ...
                                                                            </span>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() =>
                                                                                    setCurrentPage(pageNum as number)
                                                                                }
                                                                                disabled={pageNum === currentPage}
                                                                                className={cn(
                                                                                    "h-8 w-8 border rounded-md",
                                                                                    pageNum === currentPage
                                                                                        ? "bg-primary text-primary-foreground"
                                                                                        : "hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                )}
                                                                            >
                                                                                {pageNum}
                                                                            </button>
                                                                        )}
                                                                    </span>
                                                                )
                                                            )}

                                                            {/* Next (>) */}
                                                            <button
                                                                onClick={() =>
                                                                    setCurrentPage((prev) =>
                                                                        Math.min(prev + 1, totalPages)
                                                                    )
                                                                }
                                                                disabled={currentPage === totalPages}
                                                                className="h-8 w-8 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {"\u003e"}
                                                            </button>

                                                            {/* Last Page (>>) */}
                                                            <button
                                                                onClick={() => setCurrentPage(totalPages)}
                                                                disabled={currentPage === totalPages}
                                                                className="h-8 w-8 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {"\u003e\u003e"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                {/* Historical Charts Section */}
                {!error && selectedDevice && (
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        <CardTitle>Grafik Data Historis (Maksimal 8000 Data)</CardTitle>
                                    </div>
                                    <button
                                        onClick={() => setShowCharts(!showCharts)}
                                        className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm"
                                    >
                                        {showCharts ? "Sembunyikan Grafik" : "Tampilkan Grafik"}
                                        {showCharts ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {showCharts && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Menampilkan {filteredChartsData.length} dari {chartsData.length} data â€¢{" "}
                                        {selectedDevice.name} â€¢ Rentang: {timeRange.toUpperCase()}
                                        {filteredChartsData.length < 10 && timeRange === "1h" && (
                                            <span className="text-amber-600 ml-2">
                                                â€¢ Data tersedia terbatas ({filteredChartsData.length} titik dalam 1 jam)
                                            </span>
                                        )}
                                    </p>
                                )}
                            </CardHeader>

                            {showCharts && (
                                <CardContent>
                                    {chartsLoading ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                                            <p className="text-gray-600">Memuat data grafik (8000 records)...</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Ini mungkin memakan waktu beberapa detik
                                            </p>
                                        </div>
                                    ) : chartsError ? (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                            <Shield className="h-12 w-12 mx-auto mb-2 text-red-600" />
                                            <h3 className="text-lg font-semibold text-red-900 mb-2">
                                                Gagal Memuat Data Grafik
                                            </h3>
                                            <p className="text-red-700 mb-4">{chartsError}</p>
                                            <button
                                                onClick={fetchChartsData}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Coba Lagi
                                            </button>
                                        </div>
                                    ) : chartsData.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                            <p>Tidak ada data historis tersedia</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Time Range Selector */}
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Rentang Waktu:
                                                </span>
                                                {(["1h", "6h", "24h", "7d", "30d", "all"] as const).map((range) => (
                                                    <button
                                                        key={range}
                                                        onClick={() => setTimeRange(range)}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                                            timeRange === range
                                                                ? "bg-primary text-white"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        )}
                                                    >
                                                        {range === "all" ? "Semua" : range.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Chart */}
                                            <div className="w-full h-[500px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart
                                                        data={filteredChartsData}
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis
                                                            dataKey="timestamp"
                                                            tickFormatter={(value) => {
                                                                // Use the same format as the table for consistency
                                                                return formatIoTTimestamp(value);
                                                            }}
                                                            angle={-45}
                                                            textAnchor="end"
                                                            height={60}
                                                            fontSize={10}
                                                            stroke="#6b7280"
                                                        />
                                                        <YAxis stroke="#6b7280" />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                                border: "1px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                padding: "12px",
                                                            }}
                                                            labelFormatter={(value) => {
                                                                // Use the same format as the table for consistency
                                                                return formatIoTTimestamp(value);
                                                            }}
                                                        />
                                                        <Legend
                                                            wrapperStyle={{ paddingTop: "20px" }}
                                                            onClick={(e) => {
                                                                if (e.dataKey) {
                                                                    toggleSensor(e.dataKey as string);
                                                                }
                                                            }}
                                                            iconType="line"
                                                        />
                                                        {selectedDevice.sensors.map((sensor, idx) => (
                                                            <Line
                                                                key={sensor.name}
                                                                type="monotone"
                                                                dataKey={sensor.name}
                                                                stroke={chartColors[idx % chartColors.length]}
                                                                strokeWidth={2}
                                                                dot={false}
                                                                hide={!visibleSensors.has(sensor.name)}
                                                                name={
                                                                    sensor.unit &&
                                                                    !sensor.name.includes(`(${sensor.unit})`)
                                                                        ? `${sensor.name} (${sensor.unit})`
                                                                        : sensor.name
                                                                }
                                                                connectNulls
                                                            />
                                                        ))}
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Interactive Legend */}
                                            <div className="border-t pt-4">
                                                <p className="text-sm font-medium text-gray-700 mb-3">
                                                    Klik untuk menampilkan/menyembunyikan sensor:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedDevice.sensors.map((sensor, idx) => (
                                                        <button
                                                            key={sensor.name}
                                                            onClick={() => toggleSensor(sensor.name)}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm",
                                                                visibleSensors.has(sensor.name)
                                                                    ? "border-current opacity-100"
                                                                    : "border-gray-300 opacity-50"
                                                            )}
                                                            style={{
                                                                color: visibleSensors.has(sensor.name)
                                                                    ? chartColors[idx % chartColors.length]
                                                                    : "#9ca3af",
                                                            }}
                                                        >
                                                            <div
                                                                className="w-4 h-0.5 rounded"
                                                                style={{
                                                                    backgroundColor:
                                                                        chartColors[idx % chartColors.length],
                                                                }}
                                                            ></div>
                                                            <span className="font-medium">
                                                                {sensor.name}
                                                                {sensor.unit && ` (${sensor.unit})`}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Chart Info */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                                                <p className="text-blue-900">
                                                    <strong>Tips:</strong> Klik pada legend sensor untuk
                                                    menampilkan/menyembunyikan data. Gunakan filter rentang waktu untuk
                                                    fokus pada periode tertentu.
                                                </p>
                                                {filteredChartsData.length < 20 && timeRange === "1h" && (
                                                    <p className="text-blue-800 mt-2">
                                                        <strong>Info:</strong> Data sensor dikirim setiap beberapa
                                                        menit. Untuk 1 jam, hanya {filteredChartsData.length} titik data
                                                        yang tersedia. Gunakan rentang waktu lebih lama (6H/24H) untuk
                                                        melihat lebih banyak data.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

