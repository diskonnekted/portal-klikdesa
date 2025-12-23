/**
 * Map Utilities for Interactive Map Functionality
 * Handles location data, geocoding, and map operations for Sijenggung Village
 */

// Location categories for map markers
export enum LocationCategory {
    PEMERINTAHAN = "pemerintahan",
    KESEHATAN = "kesehatan",
    PENDIDIKAN = "pendidikan",
    FASILITAS_UMUM = "fasilitas_umum",
    IBADAH = "ibadah",
    EKONOMI = "ekonomi",
    OLAHRAGA = "olahraga",
    BUDAYA = "budaya",
    DARURAT = "darurat",
    TRANSPORTASI = "transportasi",
}

// Location interface
export interface MapLocation {
    id: string;
    name: string;
    category: LocationCategory;
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    description?: string;
    phone?: string;
    email?: string;
    website?: string;
    operatingHours?: {
        [key: string]: string;
    };
    images?: string[];
    tags?: string[];
    rating?: number;
    reviews?: number;
    verified: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// Search filters interface
export interface MapSearchFilters {
    categories?: LocationCategory[];
    searchTerm?: string;
    radius?: number; // in meters
    center?: [number, number]; // [lat, lng]
    openNow?: boolean;
    verified?: boolean;
    rating?: number;
}

// Route calculation interface
export interface RouteOptions {
    mode: "walking" | "driving" | "cycling";
    avoidTolls?: boolean;
    avoidHighways?: boolean;
    optimize?: boolean;
}

// Route result interface
export interface RouteResult {
    distance: number; // in meters
    duration: number; // in seconds
    steps: Array<{
        instruction: string;
        distance: number;
        duration: number;
        start_location: { lat: number; lng: number };
        end_location: { lat: number; lng: number };
    }>;
    overview_polyline?: string;
    bounds?: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
    };
}

// Geocoding result interface
export interface GeocodingResult {
    formatted_address: string;
    place_id: string;
    geometry: {
        location: { lat: number; lng: number };
        location_type: string;
        viewport: {
            northeast: { lat: number; lng: number };
            southwest: { lat: number; lng: number };
        };
    };
    address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
    }>;
    types: string[];
}

// Map bounds interface
export interface MapBounds {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
}

// Map viewport interface
export interface MapViewport {
    center: { lat: number; lng: number };
    zoom: number;
    bounds?: MapBounds;
}

// Default center coordinates for Sijenggung Village (Banjarnegara, Jateng)
export const SIJENGGUNG_CENTER = {
    lat: -7.293067,
    lng: 109.668019,
};

// Default map configuration
export const DEFAULT_MAP_CONFIG = {
    center: SIJENGGUNG_CENTER,
    zoom: 14,
    minZoom: 10,
    maxZoom: 20,
    defaultStyle: "street",
    enableClustering: true,
    enableSearch: true,
    enableDirections: true,
};

// Location category configurations
export const LOCATION_CATEGORIES = {
    [LocationCategory.PEMERINTAHAN]: {
        name: "Pemerintahan",
        icon: "ðŸ›ï¸",
        color: "#064e3b",
        description: "Kantor Desa, balai Desa, fasilitas pemerintahan",
    },
    [LocationCategory.KESEHATAN]: {
        name: "Kesehatan",
        icon: "ðŸ¥",
        color: "#dc2626",
        description: "Puskesmas, klinik, apotek, fasilitas kesehatan",
    },
    [LocationCategory.PENDIDIKAN]: {
        name: "Pendidikan",
        icon: "ðŸŽ“",
        color: "#2563eb",
        description: "Sekolah, madrasah, tempat pendidikan",
    },
    [LocationCategory.FASILITAS_UMUM]: {
        name: "Fasilitas Umum",
        icon: "ðŸ¢",
        color: "#7c3aed",
        description: "Pasar, taman, fasilitas publik lainnya",
    },
    [LocationCategory.IBADAH]: {
        name: "Tempat Ibadah",
        icon: "â›ª",
        color: "#059669",
        description: "Masjid, gereja, pura, vihara",
    },
    [LocationCategory.EKONOMI]: {
        name: "Ekonomi",
        icon: "ðŸª",
        color: "#d97706",
        description: "Toko, warung, bank, ATM",
    },
    [LocationCategory.OLAHRAGA]: {
        name: "Olahraga",
        icon: "âš½",
        color: "#0891b2",
        description: "Lapangan olahraga, gym, fasilitas olahraga",
    },
    [LocationCategory.BUDAYA]: {
        name: "Budaya",
        icon: "ðŸŽ­",
        color: "#be185d",
        description: "Museum, sanggar, tempat budaya",
    },
    [LocationCategory.DARURAT]: {
        name: "Darurat",
        icon: "ðŸš¨",
        color: "#ef4444",
        description: "Rumah sakit, pemadam kebakaran, polisi",
    },
    [LocationCategory.TRANSPORTASI]: {
        name: "Transportasi",
        icon: "ðŸšŒ",
        color: "#65a30d",
        description: "Terminal, halte bus, stasiun",
    },
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in meters
 */
export function calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const R = 6371e3; // Earth's radius in meters
    const Ï†1 = (coord1.lat * Math.PI) / 180;
    const Ï†2 = (coord2.lat * Math.PI) / 180;
    const Î”Ï† = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Î”Î» = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a = Math.sin(Î”Ï† / 2) * Math.sin(Î”Ï† / 2) + Math.cos(Ï†1) * Math.cos(Ï†2) * Math.sin(Î”Î» / 2) * Math.sin(Î”Î» / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Filter locations based on search criteria
 * @param locations - Array of locations
 * @param filters - Search filters
 * @returns Filtered locations
 */
export function filterLocations(locations: MapLocation[], filters: MapSearchFilters): MapLocation[] {
    return locations.filter((location) => {
        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(location.category)) {
                return false;
            }
        }

        // Search term filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            const searchText = `${location.name} ${location.address} ${location.description ?? ""}`.toLowerCase();
            if (!searchText.includes(searchLower)) {
                return false;
            }
        }

        // Radius filter
        if (filters.radius && filters.center) {
            const centerPoint = { lat: filters.center[0], lng: filters.center[1] };
            const distance = calculateDistance(centerPoint, location.coordinates);
            if (distance > filters.radius) {
                return false;
            }
        }

        // Open now filter
        if (filters.openNow && location.operatingHours) {
            if (!isLocationOpenNow(location.operatingHours)) {
                return false;
            }
        }

        // Verified filter
        if (filters.verified && !location.verified) {
            return false;
        }

        // Rating filter
        if (filters.rating && (!location.rating || location.rating < filters.rating)) {
            return false;
        }

        return true;
    });
}

/**
 * Check if location is open now based on operating hours
 * @param operatingHours - Operating hours object
 * @returns Boolean indicating if location is open
 */
export function isLocationOpenNow(operatingHours: { [key: string]: string }): boolean {
    const now = new Date();
    const dayName = now.toLocaleDateString("id-ID", { weekday: "long" });
    const currentTime = now.toTimeString().slice(0, 5);

    const todayHours = operatingHours[dayName];
    if (!todayHours || todayHours.toLowerCase().includes("tutup")) {
        return false;
    }

    try {
        const [openTime, closeTime] = todayHours.split(" - ");
        const current = new Date(`2000-01-01 ${currentTime}`);
        const open = new Date(`2000-01-01 ${openTime}`);
        const close = new Date(`2000-01-01 ${closeTime}`);

        return current >= open && current <= close;
    } catch {
        return false;
    }
}

/**
 * Sort locations by distance from a center point
 * @param locations - Array of locations
 * @param center - Center coordinates
 * @returns Sorted locations
 */
export function sortLocationsByDistance(locations: MapLocation[], center: { lat: number; lng: number }): MapLocation[] {
    return locations
        .map((location) => ({
            ...location,
            distance: calculateDistance(center, location.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance);
}

/**
 * Get map bounds that contain all locations
 * @param locations - Array of locations
 * @param padding - Padding factor (default: 0.1)
 * @returns Map bounds
 */
export function getBoundsForLocations(locations: MapLocation[], padding = 0.1): MapBounds | null {
    if (locations.length === 0) {
        return null;
    }

    const lats = locations.map((loc) => loc.coordinates.lat);
    const lngs = locations.map((loc) => loc.coordinates.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latPadding = (maxLat - minLat) * padding;
    const lngPadding = (maxLng - minLng) * padding;

    return {
        northeast: {
            lat: maxLat + latPadding,
            lng: maxLng + lngPadding,
        },
        southwest: {
            lat: minLat - latPadding,
            lng: minLng - lngPadding,
        },
    };
}

/**
 * Geocode address to coordinates
 * @param address - Address to geocode
 * @returns Promise resolving to geocoding result
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
        // This would integrate with a geocoding service
        // For now, return a mock implementation
        if (typeof window === "undefined") {
            // Server-side implementation
            return null;
        }

        // Client-side implementation (would use Google Maps API or similar)
        const response = await fetch(`/api/maps/geocode?address=${encodeURIComponent(address)}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Reverse geocode coordinates to address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Promise resolving to address string
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
        if (typeof window === "undefined") {
            return null;
        }

        const response = await fetch(`/api/maps/reverse-geocode?lat=${lat}&lng=${lng}`);
        if (response.ok) {
            const result = await response.json();
            return result.formatted_address;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Calculate route between two points
 * @param origin - Starting coordinates
 * @param destination - Ending coordinates
 * @param options - Route options
 * @returns Promise resolving to route result
 */
export async function calculateRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    options: RouteOptions = { mode: "driving" }
): Promise<RouteResult | null> {
    try {
        if (typeof window === "undefined") {
            return null;
        }

        const params = new URLSearchParams({
            origin: `${origin.lat},${origin.lng}`,
            destination: `${destination.lat},${destination.lng}`,
            mode: options.mode,
            avoidTolls: options.avoidTolls ? "true" : "false",
            avoidHighways: options.avoidHighways ? "true" : "false",
            optimize: options.optimize ? "true" : "false",
        });

        const response = await fetch(`/api/maps/directions?${params}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Generate shareable URL for a location
 * @param location - Location object
 * @param zoom - Zoom level (default: 15)
 * @returns Shareable URL
 */
export function generateShareUrl(location: MapLocation, zoom = 15): string {
    const { lat, lng } = location.coordinates;
    return `https://maps.google.com/?q=${lat},${lng}&z=${zoom}`;
}

/**
 * Generate directions URL
 * @param origin - Starting point
 * @param destination - Destination
 * @param mode - Travel mode
 * @returns Directions URL
 */
export function generateDirectionsUrl(
    origin: { lat: number; lng: number } | string,
    destination: { lat: number; lng: number } | string,
    mode: "driving" | "walking" | "cycling" = "driving"
): string {
    const originStr = typeof origin === "string" ? origin : `${origin.lat},${origin.lng}`;
    const destinationStr = typeof destination === "string" ? destination : `${destination.lat},${destination.lng}`;

    return `https://maps.google.com/maps/dir/${encodeURIComponent(originStr)}/${encodeURIComponent(destinationStr)}/${mode}`;
}

/**
 * Format distance for display
 * @param distanceInMeters - Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(distanceInMeters: number): string {
    if (distanceInMeters < 1000) {
        return `${Math.round(distanceInMeters)} m`;
    } else {
        const km = distanceInMeters / 1000;
        return `${km.toFixed(1)} km`;
    }
}

/**
 * Format duration for display
 * @param durationInSeconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(durationInSeconds: number): string {
    if (durationInSeconds < 60) {
        return `${durationInSeconds} detik`;
    } else if (durationInSeconds < 3600) {
        const minutes = Math.floor(durationInSeconds / 60);
        return `${minutes} menit`;
    } else {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        return minutes > 0 ? `${hours} jam ${minutes} menit` : `${hours} jam`;
    }
}

/**
 * Get user's current location
 * @returns Promise resolving to coordinates or null
 */
export function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            }
        );
    });
}

/**
 * Validate coordinates
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Boolean indicating if coordinates are valid
 */
export function validateCoordinates(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Convert Indonesian address format to standard format
 * @param address - Indonesian address
 * @returns Standardized address
 */
export function standardizeIndonesianAddress(address: string): string {
    return address
        .replace(/\bDesa\b/gi, "Desa")
        .replace(/\bKelurahan\b/gi, "Kelurahan")
        .replace(/\bKecamatan\b/gi, "Kecamatan")
        .replace(/\bKabupaten\b/gi, "Kabupaten")
        .replace(/\bKota\b/gi, "Kota")
        .replace(/\bProvinsi\b/gi, "Provinsi")
        .replace(/\bDI Yogyakarta\b/gi, "Daerah Istimewa Yogyakarta")
        .replace(/\bDIY\b/gi, "Daerah Istimewa Yogyakarta")
        .replace(/\bJl\.\b/gi, "Jalan")
        .replace(/\bRT\b/gi, "RT")
        .replace(/\bRW\b/gi, "RW")
        .trim();
}

/**
 * Extract location components from Indonesian address
 * @param address - Indonesian address
 * @returns Extracted components
 */
export function parseIndonesianAddress(address: string): {
    street?: string;
    rtRw?: string;
    village?: string;
    district?: string;
    regency?: string;
    province?: string;
    postalCode?: string;
} {
    const standardized = standardizeIndonesianAddress(address);
    const components: Record<string, string> = {};

    // Regex patterns for Indonesian addresses
    const patterns = {
        postalCode: /\b(\d{5})\b/,
        province: /(Daerah Istimewa Yogyakarta|DIY|DI Yogyakarta)/i,
        regency: /(Kabupaten|Kota)\s+([^\s,]+)/i,
        district: /Kecamatan\s+([^\s,]+)/i,
        village: /(Desa|Kelurahan)\s+([^\s,]+)/i,
        rtRw: /(RT|RW)\s*(\d+)\/(RT|RW)\s*(\d+)/i,
        street: /^(Jl\.|Jalan)\s+[^\n,]+/i,
    };

    // Extract components
    for (const [key, pattern] of Object.entries(patterns)) {
        const match = standardized.match(pattern);
        if (match) {
            switch (key) {
                case "postalCode":
                    components.postalCode = match[1];
                    break;
                case "province":
                    components.province = match[1];
                    break;
                case "regency":
                    components.regency = `${match[1]} ${match[2]}`;
                    break;
                case "district":
                    components.district = `Kecamatan ${match[1]}`;
                    break;
                case "village":
                    components.village = `${match[1]} ${match[2]}`;
                    break;
                case "rtRw":
                    components.rtRw = `${match[1]} ${match[2]}/${match[3]} ${match[4]}`;
                    break;
                case "street":
                    components.street = match[0];
                    break;
            }
        }
    }

    return components;
}

