"use client";

import { useState, useEffect } from "react";
import { fetchWeatherApi } from "openmeteo";

// Sijenggung coordinates
const LATITUDE = -7.6654545;
const LONGITUDE = 110.3073412;

export interface WeatherAnimationData {
    weatherCode: number;
    isRaining: boolean;
    isCloudy: boolean;
    isSunny: boolean;
    isFoggy: boolean;
    isStormy: boolean;
    intensity: "light" | "medium" | "heavy";
}

const getWeatherAnimationData = (weatherCode: number): WeatherAnimationData => {
    // Determine weather animation state based on Open-Meteo weather codes
    const isRaining = weatherCode >= 51 && weatherCode <= 82;
    const isCloudy = (weatherCode >= 1 && weatherCode <= 3) || weatherCode === 45 || weatherCode === 48;
    const isSunny = weatherCode === 0;
    const isFoggy = weatherCode === 45 || weatherCode === 48;
    const isStormy = weatherCode === 95 || weatherCode === 96 || weatherCode === 99;

    let intensity: "light" | "medium" | "heavy" = "light";
    if (isRaining) {
        if (weatherCode >= 51 && weatherCode <= 55) intensity = "light";
        else if (weatherCode >= 56 && weatherCode <= 65) intensity = "medium";
        else intensity = "heavy";
    }

    return {
        weatherCode,
        isRaining,
        isCloudy,
        isSunny,
        isFoggy,
        isStormy,
        intensity,
    };
};

export const useWeatherAnimation = () => {
    const [weatherData, setWeatherData] = useState<WeatherAnimationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        try {
            setLoading(true);

            const params = {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                current: ["weather_code"],
                timezone: "auto",
            };

            const url = "https://api.open-meteo.com/v1/forecast";
            const responses = await fetchWeatherApi(url, params);
            const response = responses[0];

            // Current weather data
            const current = response.current()!;
            const weatherCode = Math.round(current.variables(0)!.value());

            setWeatherData(getWeatherAnimationData(weatherCode));
            setError(null);
        } catch (err) {
            console.error("Failed to fetch weather data for animation:", err);
            setError("Gagal memuat data cuaca");
            // Set default sunny weather on error
            setWeatherData(getWeatherAnimationData(0));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchWeather();

        // Update every 30 seconds as requested
        const interval = setInterval(fetchWeather, 30 * 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        weatherData,
        loading,
        error,
        refetch: fetchWeather,
    };
};
