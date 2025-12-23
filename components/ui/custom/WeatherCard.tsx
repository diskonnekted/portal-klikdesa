"use client";

import React, { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Wind, Droplets, Loader2, Thermometer, RefreshCw } from "lucide-react";
import { fetchWeatherApi } from "openmeteo";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sijenggung coordinates
const LATITUDE = -7.6654545;
const LONGITUDE = 110.3073412;

interface WeatherData {
    current: {
        temperature: number;
        humidity: number;
        windSpeed: number;
        weatherCode: number;
    };
    daily: {
        date: Date;
        maxTemp: number;
        minTemp: number;
        weatherCode: number;
        precipitationProbability: number;
        windSpeed: number;
    }[];
}

const weatherCodeToDescription = (code: number): string => {
    // Open Meteo weather code mapping
    if (code === 0) return "Cerah";
    if (code === 1 || code === 2 || code === 3) return "Berawan";
    if (code === 45 || code === 48) return "Berkabut";
    if (code >= 51 && code <= 67) return "Hujan Ringan";
    if (code >= 71 && code <= 77) return "Salju";
    if (code >= 80 && code <= 82) return "Hujan Lebat";
    if (code === 95 || code === 96 || code === 99) return "Badai Petir";
    return "Berawan";
};

const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-20 w-20 text-yellow-500" />;
    if (code >= 1 && code <= 3) return <Cloud className="h-20 w-20 text-gray-500" />;
    if (code >= 51 && code <= 82) return <CloudRain className="h-20 w-20 text-blue-500" />;
    return <Sun className="h-20 w-20 text-yellow-500" />;
};

const getSmallWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-5 w-5 text-yellow-500" />;
    if (code >= 1 && code <= 3) return <Cloud className="h-5 w-5 text-gray-500" />;
    if (code >= 51 && code <= 82) return <CloudRain className="h-5 w-5 text-blue-500" />;
    return <Sun className="h-5 w-5 text-yellow-500" />;
};

export function WeatherCard() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchWeather = async (isManualRefresh = false) => {
        try {
            if (isManualRefresh) {
                setIsRefreshing(true);
            } else {
                setLoading(true);
            }

            const params = {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                current: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "weather_code"],
                daily: [
                    "weather_code",
                    "temperature_2m_max",
                    "temperature_2m_min",
                    "precipitation_probability_max",
                    "wind_speed_10m_max",
                ],
                timezone: "auto",
                forecast_days: 7,
            };

            const url = "https://api.open-meteo.com/v1/forecast";
            const responses = await fetchWeatherApi(url, params);
            const response = responses[0];

            // Current weather data
            const current = response.current()!;
            const currentWeather = {
                temperature: Math.round(current.variables(0)!.value()),
                humidity: Math.round(current.variables(1)!.value()),
                windSpeed: Math.round(current.variables(2)!.value()),
                weatherCode: Math.round(current.variables(3)!.value()),
            };

            // Daily forecast data
            const daily = response.daily()!;
            const maxTempArray = daily.variables(1)?.valuesArray();
            const minTempArray = daily.variables(2)?.valuesArray();
            const weatherCodeArray = daily.variables(0)?.valuesArray();
            const precipitationArray = daily.variables(3)?.valuesArray();
            const windSpeedArray = daily.variables(4)?.valuesArray();

            const dailyForecast = Array.from({ length: 7 }, (_, i) => {
                const date = new Date((Number(daily.time()) + i * 24 * 3600) * 1000);
                return {
                    date,
                    maxTemp: maxTempArray ? Math.round(maxTempArray[i]) : 0,
                    minTemp: minTempArray ? Math.round(minTempArray[i]) : 0,
                    weatherCode: weatherCodeArray ? Math.round(weatherCodeArray[i]) : 0,
                    precipitationProbability: precipitationArray ? Math.round(precipitationArray[i]) : 0,
                    windSpeed: windSpeedArray ? Math.round(windSpeedArray[i]) : 0,
                };
            });

            setWeatherData({
                current: currentWeather,
                daily: dailyForecast,
            });
            setLastUpdate(new Date());
            setError(null);
        } catch {
            setError("Gagal memuat data cuaca");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchWeather();

        // Auto-refresh every 5 minutes
        const interval = setInterval(
            () => {
                fetchWeather();
            },
            5 * 60 * 1000
        ); // 5 minutes

        return () => clearInterval(interval);
    }, []);

    const handleManualRefresh = () => {
        fetchWeather(true);
    };

    if (loading) {
        return (
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-primary">
                        <Sun className="h-5 w-5 text-primary" />
                        Cuaca Hari Ini
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !weatherData) {
        return (
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-primary">
                        <Sun className="h-5 w-5 text-primary" />
                        Cuaca Hari Ini
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <p className="text-muted-foreground">{error ?? "Data tidak tersedia"}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "short",
            day: "numeric",
            month: "short",
        };
        return date.toLocaleDateString("id-ID", options);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    return (
        <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg text-primary">
                        <Sun className="h-5 w-5 text-primary" />
                        Cuaca Hari Ini
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">
                            {lastUpdate &&
                                `Update: ${lastUpdate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}
                        </div>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleManualRefresh}
                            disabled={isRefreshing}
                            className="h-8 w-8 p-0 hover:bg-secondary hover:border-primary"
                        >
                            <RefreshCw
                                className={`h-4 w-4 text-white hover:text-primary ${isRefreshing ? "animate-spin" : ""}`}
                            />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Current Weather */}
                <div className="text-center mb-6">
                    <div className="flex flex-col items-center justify-center gap-2 mb-4">
                        <div>{getWeatherIcon(weatherData.current.weatherCode)}</div>
                        <div className="flex items-center gap-2">
                            <Thermometer className="h-8 w-8 text-orange-500" />
                            <div className="text-6xl font-bold">{weatherData.current.temperature}°C</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {weatherCodeToDescription(weatherData.current.weatherCode)}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="outline bg-white rounded-lg p-2">
                            <div className="flex items-center gap-1 font-medium">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                Kelembaban
                            </div>
                            <div className="text-muted-foreground text-2xl">{weatherData.current.humidity}%</div>
                        </div>
                        <div className="outline bg-white rounded-lg p-2">
                            <div className="flex items-center gap-1 font-medium">
                                <Wind className="h-4 w-4 text-[#4a5f8c]" />
                                Kecepatan Angin
                            </div>
                            <div className="text-muted-foreground text-2xl">{weatherData.current.windSpeed} km/h</div>
                        </div>
                    </div>
                </div>

                {/* 7-Day Forecast */}
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Prakiraan 7 Hari</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {weatherData.daily.slice(1, 7).map((day, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-lg p-3 text-center border ${
                                    isToday(day.date) ? "border-primary bg-primary/5" : "border-gray-200"
                                }`}
                            >
                                <div className="text-xs font-medium mb-2">
                                    {isToday(day.date) ? "Hari Ini" : formatDate(day.date)}
                                </div>
                                <div className="flex justify-center mb-2">{getSmallWeatherIcon(day.weatherCode)}</div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    {weatherCodeToDescription(day.weatherCode)}
                                </div>
                                <div className="text-sm font-semibold text-primary">
                                    {day.maxTemp}°/{day.minTemp}°
                                </div>
                                {day.precipitationProbability > 30 && (
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <Droplets className="h-3 w-3 text-blue-500" />
                                        <span className="text-xs text-blue-600">{day.precipitationProbability}%</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
