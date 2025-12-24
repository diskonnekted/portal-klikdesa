"use client";

import * as React from "react";
import Image from "next/image";
import { IDMDisplay } from "@/components/ui/custom/IDMDisplay";
import { IDMDetailTable } from "@/components/ui/custom/IDMDetailTable";
import { YearSelector } from "@/components/ui/custom/YearSelector";
import { IDMDataNotAvailable } from "@/components/ui/custom/IDMDataNotAvailable";
import { IDMDataLoading } from "@/components/ui/custom/IDMDataLoading";

interface IDMData {
    SUMMARIES: {
        SKOR_SAAT_INI: number;
        STATUS: string;
        TARGET_STATUS: string;
        SKOR_MINIMAL: number;
        PENAMBAHAN: number;
        TAHUN: number;
    };
    ROW: Array<{
        NO: number | null;
        INDIKATOR: string;
        SKOR: number | string;
        KETERANGAN: string | null;
        KEGIATAN: string | null;
        NILAI: string | null;
        PUSAT: string | null;
        PROV: string | null;
        KAB: string | null;
        DESA: string | null;
        CSR: string | null;
        LAINNYA: string | null;
        ROW_CELL: number;
    }>;
    IDENTITAS: Array<{
        nama_provinsi: string;
        id_prov: string;
        id_kabupaten: string;
        nama_kab_kota: string;
        id_kecamatan: string;
        nama_kecamatan: string;
        id_desa: string;
        nama_desa: string;
    }>;
}

// Function to fetch IDM data from API
const fetchIDMData = async (year: string = "2024"): Promise<IDMData | null> => {
    try {
        const response = await fetch(`/api/idm?year=${year}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch IDM data: ${response.status}`);
        }

        const data = await response.json();
        // IDM API returns: { data: [{ attributes: { SUMMARIES, ROW, IDENTITAS } }] }
        // We need to extract the attributes from the first item
        return data.data?.[0]?.attributes || null;
    } catch (error) {
        console.error("Failed to fetch IDM data:", error);
        return null;
    }
};

export default function IDMPage() {
    const [data, setData] = React.useState<IDMData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [selectedYear, setSelectedYear] = React.useState<number>(2024);

    // Calculate available years (2021 to current year)
    // Using fixed current year to avoid Next.js prerender issues
    // TODO: Update this value annually (e.g., change 2025 to 2026 in 2026)
    const currentYear = 2025;
    const availableYears = React.useMemo(() => {
        const years = [];
        for (let year = 2021; year <= currentYear; year++) {
            years.push(year);
        }
        return years;
    }, [currentYear]);

    React.useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setData(null);

            // Create a timeout promise that rejects after 30 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Timeout: API took too long")), 30000);
            });

            try {
                const result = await Promise.race([fetchIDMData(selectedYear.toString()), timeoutPromise]);
                setData(result as IDMData);
            } catch (error) {
                console.error("Failed to load IDM data:", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [selectedYear]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4 space-y-8">
                    {/* Page Header with Year Selector */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center rounded-full">
                            <Image
                                src="/images/idm/logo.png"
                                alt="Logo IDM"
                                width={256}
                                height={256}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Indeks Desa Mandiri (IDM)</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Evaluasi menyeluruh terhadap capaian Indeks Desa Mandiri
                        </p>

                        {/* Year Selector */}
                        <div className="mt-6">
                            <YearSelector
                                years={availableYears}
                                selectedYear={selectedYear}
                                onYearChange={setSelectedYear}
                                className="max-w-4xl mx-auto"
                            />
                        </div>
                    </div>

                    {/* Loading State */}
                    <IDMDataLoading onTimeout={() => setData(null)} year={selectedYear} />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
                <div className="container mx-auto px-4 space-y-8">
                    {/* Page Header with Year Selector */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center rounded-full">
                            <Image
                                src="/images/idm/logo.png"
                                alt="Logo IDM"
                                width={256}
                                height={256}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Indeks Desa Mandiri (IDM)</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Evaluasi menyeluruh terhadap capaian Indeks Desa Mandiri
                        </p>

                        {/* Year Selector */}
                        <div className="mt-6">
                            <YearSelector
                                years={availableYears}
                                selectedYear={selectedYear}
                                onYearChange={setSelectedYear}
                                className="max-w-4xl mx-auto"
                            />
                        </div>
                    </div>

                    {/* Data Not Available State */}
                    <IDMDataNotAvailable
                        year={selectedYear}
                        onRetry={() => {
                            const loadData = async () => {
                                try {
                                    setLoading(true);
                                    const result = await fetchIDMData(selectedYear.toString());
                                    setData(result);
                                } catch (error) {
                                    console.error("Failed to load IDM data:", error);
                                    setData(null);
                                } finally {
                                    setLoading(false);
                                }
                            };
                            loadData();
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4 space-y-8">
                {/* Page Header with Year Selector */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center rounded-full">
                        <Image
                            src="/images/idm/logo.png"
                            alt="Logo IDM"
                            width={256}
                            height={256}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Indeks Desa Mandiri (IDM)</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Evaluasi menyeluruh terhadap capaian Indeks Desa Mandiri
                    </p>

                    {/* Year Selector */}
                    <div className="mt-6">
                        <YearSelector
                            years={availableYears}
                            selectedYear={selectedYear}
                            onYearChange={setSelectedYear}
                            className="max-w-4xl mx-auto"
                        />
                    </div>
                </div>

                {/* IDM Summary Cards and Charts */}
                <IDMDisplay year={selectedYear.toString()} />

                {/* Detailed Table */}
                <IDMDetailTable data={data} />
            </div>
        </div>
    );
}
