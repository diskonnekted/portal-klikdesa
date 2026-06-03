import { useState, useEffect } from 'react';

export interface PkkDataRecord {
    _id: number;
    Kecamatan: string;
    Pangan: string;
    Sandang: string;
    Konveksi: string;
    Jasa: string;
    Lain0Lain: string;
    "Jumlah Percontohan Home Industri": string;
    "Rumah Sehat": string;
    "Rumah Kurang Sehat": string;
    "Jumlah Percontohan Rumah Sehat": string;
    Tahun: string;
}

export function useOpenDataPKK() {
    const [data, setData] = useState<PkkDataRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = "https://opendata.banjarnegarakab.go.id/api/3/action/datastore_search?resource_id=8de567d6-b51e-402f-9ff6-7fda822a72e9&limit=100";
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch OpenData");
                }
                const json = await response.json();
                if (json.success && json.result && json.result.records) {
                    // Filter to only get the latest year data (2022) or just use all records
                    // Since it contains multiple years, we group by Kecamatan and pick the latest
                    const records: PkkDataRecord[] = json.result.records;
                    
                    const latestByKecamatan: Record<string, PkkDataRecord> = {};
                    records.forEach(record => {
                        const kec = record.Kecamatan.toUpperCase().trim();
                        // If multiple years, take max year
                        if (!latestByKecamatan[kec] || parseInt(record.Tahun) > parseInt(latestByKecamatan[kec].Tahun)) {
                            latestByKecamatan[kec] = record;
                        }
                    });
                    
                    setData(Object.values(latestByKecamatan));
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
    }, []);

    return { pkkData: data, loading, error };
}
