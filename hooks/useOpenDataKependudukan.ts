import { useState, useEffect } from 'react';

export interface DemographyData {
    umur: Array<{ nama: string; total: number }>;
    pendidikan: Array<{ nama: string; total: number }>;
    pekerjaan: Array<{ nama: string; total: number }>;
    agama: Array<{ nama: string; total: number }>;
    golongan: Array<{ nama: string; total: number }>;
    total: {
        total_penduduk: string;
        total_laki_laki: string;
        total_perempuan: string;
        total_disabilitas: string;
    };
}

export function useOpenDataKependudukan(kecamatan: string | null, desaName: string | null) {
    const [data, setData] = useState<DemographyData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [noOpenSID, setNoOpenSID] = useState<boolean>(false);

    useEffect(() => {
        if (!kecamatan || !desaName) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setNoOpenSID(false);

            try {
                // 1. Fetch desa list for the given kecamatan
                const cleanKecamatan = kecamatan.replace(/kecamatan/i, '').replace(/kec\./i, '').trim().toLowerCase();
                const listUrl = `/api/opendata-desa-list?kecamatan=${encodeURIComponent(cleanKecamatan)}`;
                
                const listRes = await fetch(listUrl);
                if (!listRes.ok) throw new Error("Gagal mengambil daftar desa dari API pusat");
                
                const listData = await listRes.json();
                
                if (!Array.isArray(listData) || listData.length === 0) {
                    setNoOpenSID(true);
                    setLoading(false);
                    return;
                }

                // 2. Find matching desa_id
                const cleanTargetDesa = desaName.replace(/desa/i, '').replace(/kelurahan/i, '').trim().toLowerCase();
                const matchedDesa = listData.find((d: any) => {
                    const cleanName = d.nama.replace(/desa/i, '').replace(/kelurahan/i, '').trim().toLowerCase();
                    return cleanName === cleanTargetDesa;
                });

                if (!matchedDesa || !matchedDesa.desa_id) {
                    setNoOpenSID(true);
                    setLoading(false);
                    return;
                }

                // 3. Fetch kependudukan data
                const targetDesaId = matchedDesa.desa_id;
                const kependudukanUrl = `/api/opendata-kependudukan?kecamatan=${encodeURIComponent(cleanKecamatan)}&desa_id=${encodeURIComponent(targetDesaId)}`;
                
                const dataRes = await fetch(kependudukanUrl);
                if (!dataRes.ok) throw new Error("Gagal mengambil data kependudukan spesifik");
                
                const dataJson = await dataRes.json();
                
                if (dataJson.status === 200 && dataJson.messages) {
                    // Normalize the data for recharts
                    const messages = dataJson.messages;
                    
                    const normalizeDaftar = (daftar: any[]) => {
                        if (!Array.isArray(daftar)) return [];
                        return daftar.map(d => ({
                            nama: d.nama || "Tidak Diketahui",
                            total: parseInt(d.total?.toString() || "0")
                        }));
                    };

                    setData({
                        umur: normalizeDaftar(messages.umur?.daftar),
                        pendidikan: normalizeDaftar(messages.pendidikan?.daftar),
                        pekerjaan: normalizeDaftar(messages.pekerjaan?.daftar),
                        agama: normalizeDaftar(messages.agama?.daftar),
                        golongan: normalizeDaftar(messages.golongan?.daftar),
                        total: {
                            total_penduduk: messages.total?.total_penduduk || "0",
                            total_laki_laki: messages.total?.total_laki_laki || "0",
                            total_perempuan: messages.total?.total_perempuan || "0",
                            total_disabilitas: messages.total?.total_disabilitas || "0"
                        }
                    });
                } else {
                    setNoOpenSID(true);
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message);
                setNoOpenSID(true); // Treat fetch errors as unavailable OpenSID gracefully
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [kecamatan, desaName]);

    return { 
        demographyData: data, 
        demographyLoading: loading, 
        demographyError: error,
        noOpenSID 
    };
}
