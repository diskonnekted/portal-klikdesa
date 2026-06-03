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
                    
                    const recordsByDesa: Record<string, DesaStuntingRecord[]> = {};
                    records.forEach(record => {
                        // Normalize village name by removing 'Desa/Kelurahan' prefix if exists and trimming
                        let desa = record["Desa/Kelurahan"]?.replace(/desa/i, '').replace(/kelurahan/i, '').trim().toUpperCase();
                        if (!desa) return;
                        if (!recordsByDesa[desa]) recordsByDesa[desa] = [];
                        recordsByDesa[desa].push(record);
                    });
                    
                    const latestByDesa: Record<string, DesaStuntingRecord> = {};
                    for (const [desa, desaRecords] of Object.entries(recordsByDesa)) {
                        // Sort descending by year
                        desaRecords.sort((a, b) => parseInt(b.Tahun || "0") - parseInt(a.Tahun || "0"));
                        
                        // Find the most recent year with actual valid data (not 0, not NA)
                        let validRecord = desaRecords.find(r => {
                            const val = r["Jumlah Seluruh Balita"];
                            return val && val !== "0" && val !== "NA" && String(val).trim() !== "";
                        });
                        
                        // Fallback to the latest record if all are invalid
                        latestByDesa[desa] = validRecord || desaRecords[0];
                    }
                    
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
