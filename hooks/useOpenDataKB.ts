import { useState, useEffect } from 'react';

export interface KbDataRecord {
    _id: number;
    Kecamatan: string;
    Aktif: string;
    Baru: string;
    Tahun: string;
}

export function useOpenDataKB() {
    const [data, setData] = useState<KbDataRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use local Next.js proxy to bypass CORS
                const url = "/api/opendata-kb";
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch OpenData KB");
                }
                const json = await response.json();
                if (json.success && json.result && json.result.records) {
                    const records: KbDataRecord[] = json.result.records;
                    
                    const latestByKecamatan: Record<string, KbDataRecord> = {};
                    records.forEach(record => {
                        const kec = record.Kecamatan.toUpperCase().trim();
                        // If multiple years, take max year
                        if (!latestByKecamatan[kec] || parseInt(record.Tahun) > parseInt(latestByKecamatan[kec].Tahun)) {
                            latestByKecamatan[kec] = record;
                        }
                    });
                    
                    setData(Object.values(latestByKecamatan));
                } else {
                    throw new Error("Invalid format from OpenData KB");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { kbData: data, kbLoading: loading, kbError: error };
}
