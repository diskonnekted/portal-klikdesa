// Shared ThingSpeak data fetcher for both API routes and WebSocket

export interface ThingSpeakChannel {
    id: string;
    name: string;
    location: string;
    lat: number;
    lng: number;
}

export interface IoTSensor {
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

export interface IoTDevice {
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

export interface HistoricalDataEntry {
    timestamp: string;
    entry_id: number;
    [key: string]: string | number; // Dynamic sensor values
}

// Define all ThingSpeak channels
export const THINGSPEAK_CHANNELS: ThingSpeakChannel[] = [
    {
        id: "3155825",
        name: "IoT Monitoring Station 1",
        location: "Kantor Desa",
        lat: -7.663494,
        lng: 110.306996,
    },
    {
        id: "3156242",
        name: "IoT Monitoring Station 2",
        location: "Kantor Desa",
        lat: -7.663494,
        lng: 110.306996,
    },
    {
        id: "3160660",
        name: "IoT Monitoring Station 3",
        location: "Kantor Desa",
        lat: -7.663494,
        lng: 110.306996,
    },
];

// Helper function to determine sensor type based on field name
function getSensorType(fieldName: string | null): string {
    if (!fieldName) return "unknown";
    const name = fieldName.toLowerCase();
    if (name.includes("tegangan") || name.includes("voltage")) return "voltage";
    if (name.includes("arus") || name.includes("current")) return "current";
    if (name.includes("daya") || name.includes("power")) return "power";
    if (name.includes("energi") || name.includes("energy")) return "energy";
    if (name.includes("biaya") || name.includes("cost") || name.includes("kwh")) return "cost";
    if (name.includes("suhu") || name.includes("temperature")) return "temperature";
    if (name.includes("kelembaban") || name.includes("humidity")) return "humidity";
    if (name.includes("gempa") || name.includes("seismic")) return "seismic";
    if (name.includes("tanah") || name.includes("soil")) return "soil-moisture";
    if (name.includes("kehadiran") || name.includes("presence")) return "presence";
    if (name.includes("air") || name.includes("quality")) return "air-quality";
    return "custom";
}

// Cache for ThingSpeak data
let cachedData: { devices: IoTDevice[]; summary: unknown; timestamp: number } | null = null;
const CACHE_DURATION = 15000; // 15 seconds cache

// Thresholds for device status (in milliseconds)
const STATUS_THRESHOLDS = {
    ACTIVE: 5 * 60 * 1000, // 5 minutes - device is active
    WARNING: 15 * 60 * 1000, // 15 minutes - device might have issues
    CRITICAL: 30 * 60 * 1000, // 30 minutes - device has serious issues
    // Anything beyond critical is considered inactive/offline
};

// Function to determine device status based on last update time
function calculateDeviceStatus(lastUpdateString: string): "active" | "inactive" | "warning" | "critical" {
    const lastUpdate = new Date(lastUpdateString).getTime();
    const now = Date.now();
    const timeSinceUpdate = now - lastUpdate;

    if (timeSinceUpdate <= STATUS_THRESHOLDS.ACTIVE) {
        return "active";
    } else if (timeSinceUpdate <= STATUS_THRESHOLDS.WARNING) {
        return "warning";
    } else if (timeSinceUpdate <= STATUS_THRESHOLDS.CRITICAL) {
        return "critical";
    } else {
        return "inactive";
    }
}

// Function to format "last seen" time in human-readable format
export function formatLastSeen(lastUpdateString: string): string {
    const lastUpdate = new Date(lastUpdateString).getTime();
    const now = Date.now();
    const diffMs = now - lastUpdate;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) {
        return "Baru saja";
    } else if (minutes < 60) {
        return `${minutes} menit yang lalu`;
    } else if (hours < 24) {
        return `${hours} jam yang lalu`;
    } else {
        return `${days} hari yang lalu`;
    }
}

// Function to fetch channel data
async function fetchChannelData(
    channelId: string,
    channelConfig: ThingSpeakChannel,
    results: number = 20
): Promise<IoTDevice> {
    const API_BASE_URL = `https://api.thingspeak.com/channels/${channelId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const feedsResponse = await fetch(`${API_BASE_URL}/feeds.json?results=${results}`, {
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept: "application/json",
                "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
            },
            cache: "no-store",
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!feedsResponse.ok) {
            throw new Error(`Failed to fetch ThingSpeak feeds: ${feedsResponse.status}`);
        }

        const feedsData = await feedsResponse.json();

        // Extract latest data
        const latestFeed = feedsData.feeds[feedsData.feeds.length - 1];
        const channel = feedsData.channel;

        // Create sensors from channel fields first (only include fields that have names)
        const sensors: IoTSensor[] = [];
        for (let i = 1; i <= 8; i++) {
            const fieldName = channel[`field${i}` as keyof typeof channel] as string | null;
            if (fieldName) {
                sensors.push({
                    id: `${channelConfig.id}-SNS${String(i).padStart(3, "0")}`,
                    name: fieldName,
                    type: getSensorType(fieldName) as IoTSensor["type"],
                    value: parseFloat((latestFeed[`field${i}` as keyof typeof latestFeed] as string) || "0"),
                    unit: fieldName.match(/\(([^)]+)\)/)?.[1] || "", // Extract unit from "Name (Unit)" format
                    description: fieldName,
                });
            }
        }

        // Get historical data - newest first
        const historicalData: HistoricalDataEntry[] = feedsData.feeds
            .map((feed: Record<string, unknown>) => {
                const historyEntry: Record<string, unknown> = {
                    timestamp: feed.created_at,
                    entry_id: feed.entry_id,
                };

                // Add field data
                sensors.forEach((sensor, idx) => {
                    const fieldKey = `field${idx + 1}`;
                    historyEntry[sensor.name] = parseFloat((feed[fieldKey] as string) || "0");
                });

                return historyEntry;
            })
            .reverse(); // Reverse to show newest data first

        // Calculate device status based on last update time
        const deviceStatus = calculateDeviceStatus(latestFeed.created_at);

        // Create and return the complete device object
        const device: IoTDevice = {
            id: `DEV${channelConfig.id}`,
            name: channelConfig.name,
            type: "multi-sensor",
            lat: channelConfig.lat,
            lng: channelConfig.lng,
            status: deviceStatus,
            battery: 100, // Not used - devices are mains-powered
            description: "Multi-sensor monitoring station",
            location: channelConfig.location,
            lastUpdate: latestFeed.created_at,
            channel_id: channel.id,
            entry_id: latestFeed.entry_id,
            sensors: sensors,
            historicalData: historicalData,
        };

        return device;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Main function to fetch all IoT data
export async function fetchAllIoTData(): Promise<{ devices: IoTDevice[]; summary: unknown }> {
    // Check cache first
    const now = Date.now();
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        console.log("Returning cached IoT data");
        return { devices: cachedData.devices, summary: cachedData.summary };
    }

    const devices: IoTDevice[] = [];
    const errors: { channel: string; error: unknown }[] = [];
    let totalSensors = 0;
    let activeSensors = 0;

    // Fetch data from all channels IN PARALLEL
    const fetchPromises = THINGSPEAK_CHANNELS.map((channel) =>
        fetchChannelData(channel.id, channel)
            .then((device) => ({ device, error: null, channel: channel.id }))
            .catch((error) => {
                console.error(`Error fetching data for channel ${channel.id}:`, error);
                return { device: null, error, channel: channel.id };
            })
    );

    const results = await Promise.all(fetchPromises);

    // Process results - only add successful devices
    for (const result of results) {
        if (result.device) {
            devices.push(result.device);
            totalSensors += result.device.sensors.length;
            activeSensors += result.device.sensors.filter(() => result.device.status === "active").length;
        } else if (result.error) {
            errors.push({ channel: result.channel, error: result.error });
        }
    }

    // If no devices were successfully fetched, throw an error
    if (devices.length === 0) {
        const errorMessages = errors
            .map((e) => `Channel ${e.channel}: ${(e.error as Error).message || "Unknown error"}`)
            .join("; ");
        throw new Error(`Failed to fetch any IoT devices. Errors: ${errorMessages}`);
    }

    // Log warnings for partial failures
    if (errors.length > 0) {
        console.warn(`Some channels failed to fetch: ${errors.map((e) => e.channel).join(", ")}`);
    }

    const result = {
        devices,
        summary: {
            totalDevices: devices.length,
            totalSensors,
            activeSensors,
            warningSensors: 0,
            criticalSensors: 0,
        },
        errors: errors.length > 0 ? errors : undefined,
    };

    // Cache the result
    cachedData = {
        devices: result.devices,
        summary: result.summary,
        timestamp: Date.now(),
    };

    return result;
}

