import { useState, useEffect } from 'react';

export interface KesejahteraanDataRecord {
    _id: number;
    Kecamatan: string;
    "Status Kesejahteraan 1": string;
    "Status Kesejahteraan 2": string;
    "Status Kesejahteraan 3": string;
    "Status Kesejahteraan 4": string;
    Tahun: string;
}

export function useOpenDataKesejahteraan() {
    const [data, setData] = useState<KesejahteraanDataRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use local Next.js proxy to bypass CORS
                const url = "/api/opendata-kesejahteraan";
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch OpenData Kesejahteraan");
                }
                const json = await response.json();
                if (json.success && json.result && json.result.records) {
                    const records: KesejahteraanDataRecord[] = json.result.records;
                    
                    const latestByKecamatan: Record<string, KesejahteraanDataRecord> = {};
                    records.forEach(record => {
                        const kec = record.Kecamatan.toUpperCase().trim();
                        // If multiple years, take max year
                        if (!latestByKecamatan[kec] || parseInt(record.Tahun) > parseInt(latestByKecamatan[kec].Tahun)) {
                            latestByKecamatan[kec] = record;
                        }
                    });
                    
                    setData(Object.values(latestByKecamatan));
                } else {
                    throw new Error("Invalid format from OpenData Kesejahteraan");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { kesejahteraanData: data, kesejahteraanLoading: loading, kesejahteraanError: error };
}
