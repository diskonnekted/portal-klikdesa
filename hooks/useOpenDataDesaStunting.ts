import { useState, useEffect } from 'react';

export interface DesaStuntingRecord {
    _id: number;
    "Desa/Kelurahan": string;
    "Jumlah Seluruh Balita": string;
    "Jumlah Balita Stunting": string;
    "Persentase* (%)": string;
    "jumlah balita yang ikut posyandu": string;
    Tahun: string;
}

export function useOpenDataDesaStunting(resourceId: string | null) {
    const [data, setData] = useState<DesaStuntingRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!resourceId) {
            setLoading(false);
            setData([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Use local Next.js proxy to bypass CORS
                const url = `/api/opendata-desa-stunting?resource_id=${resourceId}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch OpenData Desa Stunting");
                }
                const json = await response.json();
                if (json.success && json.result && json.result.records) {
                    const records: DesaStuntingRecord[] = json.result.records;
                    
                    const latestByDesa: Record<string, DesaStuntingRecord> = {};
                    records.forEach(record => {
                        // Normalize village name by removing 'Desa/Kelurahan' prefix if exists and trimming
                        let desa = record["Desa/Kelurahan"].replace(/desa/i, '').replace(/kelurahan/i, '').trim().toUpperCase();
                        // If multiple years, take max year
                        if (!latestByDesa[desa] || parseInt(record.Tahun) > parseInt(latestByDesa[desa].Tahun)) {
                            latestByDesa[desa] = record;
                        }
                    });
                    
                    setData(Object.values(latestByDesa));
                } else {
                    throw new Error("Invalid format from OpenData");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resourceId]);

    return { desaStuntingData: data, desaStuntingLoading: loading, desaStuntingError: error };
}
