import { NextResponse } from "next/server";
import { fetchOpenSIDKeuangan } from "@/lib/api-helpers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun") || "2025";
    const yearInt = parseInt(tahun);

    const fixedApbdesByYear: Record<
        string,
        {
            pendapatanAnggaran: number;
            pendapatanRealisasi: number;
            belanjaAnggaran: number;
            belanjaRealisasi: number;
            pembiayaanAnggaran: number;
            pembiayaanRealisasi: number;
        }
    > = {
        "2025": {
            pendapatanAnggaran: 2520038620,
            pendapatanRealisasi: 2523368850,
            belanjaAnggaran: 2443579353,
            belanjaRealisasi: 2397607389,
            pembiayaanAnggaran: -80913521,
            pembiayaanRealisasi: -120149521,
        },
        "2024": {
            pendapatanAnggaran: 3408254000,
            pendapatanRealisasi: 3402381469,
            belanjaAnggaran: 3130572680,
            belanjaRealisasi: 3058551572,
            pembiayaanAnggaran: 49840336,
            pembiayaanRealisasi: 49840336,
        },
        "2023": {
            pendapatanAnggaran: 3205036000,
            pendapatanRealisasi: 3214755986,
            belanjaAnggaran: 2793429071,
            belanjaRealisasi: 2763804347,
            pembiayaanAnggaran: 218553271,
            pembiayaanRealisasi: 218574397,
        },
        "2022": {
            pendapatanAnggaran: 1911795500,
            pendapatanRealisasi: 1915612801,
            belanjaAnggaran: 1664215618,
            belanjaRealisasi: 1449131522,
            pembiayaanAnggaran: 114591118,
            pembiayaanRealisasi: 114591118,
        },
    };
    const fixedApbdes = fixedApbdesByYear[tahun] ?? null;

    const baseAmount = 1200000000;
    const yearlyIncrease = 0.05;
    const yearDiff = yearInt - 2021;
    const factor = Math.pow(1 + yearlyIncrease, Math.max(0, yearDiff));

    const targetPendapatan = fixedApbdes?.pendapatanAnggaran ?? Math.floor(baseAmount * factor);
    const targetBelanja = fixedApbdes?.belanjaAnggaran ?? Math.floor(targetPendapatan * 0.98);
    const realisasiPendapatan =
        fixedApbdes?.pendapatanRealisasi ?? Math.floor(targetPendapatan * 0.95);
    const realisasiBelanja = fixedApbdes?.belanjaRealisasi ?? Math.floor(targetBelanja * 0.9);
    const targetPembiayaan =
        fixedApbdes?.pembiayaanAnggaran ?? Math.floor(targetPendapatan - targetBelanja);
    const realisasiPembiayaan =
        fixedApbdes?.pembiayaanRealisasi ?? Math.floor(realisasiPendapatan - realisasiBelanja);

    const mockFallbackData = [
        {
            type: "apbdes",
            id: "1",
            attributes: {
                tahun: tahun,
                pendapatan: {
                    "0": {
                        anggaran: targetPendapatan.toString(),
                        realisasi: realisasiPendapatan,
                        persen: Math.round((realisasiPendapatan / targetPendapatan) * 1000) / 10,
                        judul: "PENDAPATAN",
                    },
                    "1": {
                        anggaran: Math.floor(targetPendapatan * 0.6).toString(),
                        realisasi: Math.floor(realisasiPendapatan * 0.6),
                        persen:
                            Math.round((Math.floor(realisasiPendapatan * 0.6) / Math.floor(targetPendapatan * 0.6)) * 1000) /
                            10,
                        judul: "PENDAPATAN ASLI DESA",
                    },
                    "2": {
                        anggaran: Math.floor(targetPendapatan * 0.4).toString(),
                        realisasi: Math.floor(realisasiPendapatan * 0.4),
                        persen:
                            Math.round((Math.floor(realisasiPendapatan * 0.4) / Math.floor(targetPendapatan * 0.4)) * 1000) /
                            10,
                        judul: "PENDAPATAN TRANSFER",
                    }
                },
                belanja: {
                    "0": {
                        anggaran: targetBelanja.toString(),
                        realisasi: realisasiBelanja,
                        persen: Math.round((realisasiBelanja / targetBelanja) * 1000) / 10,
                        judul: "BELANJA",
                    },
                    "1": {
                        anggaran: Math.floor(targetBelanja * 0.3).toString(),
                        realisasi: Math.floor(realisasiBelanja * 0.3),
                        persen:
                            Math.round((Math.floor(realisasiBelanja * 0.3) / Math.floor(targetBelanja * 0.3)) * 1000) /
                            10,
                        judul: "BIDANG PENYELENGGARAAN PEMERINTAHAN DESA",
                    },
                    "2": {
                        anggaran: Math.floor(targetBelanja * 0.4).toString(),
                        realisasi: Math.floor(realisasiBelanja * 0.4),
                        persen:
                            Math.round((Math.floor(realisasiBelanja * 0.4) / Math.floor(targetBelanja * 0.4)) * 1000) /
                            10,
                        judul: "BIDANG PELAKSANAAN PEMBANGUNAN DESA",
                    },
                     "3": {
                        anggaran: Math.floor(targetBelanja * 0.1).toString(),
                        realisasi: Math.floor(realisasiBelanja * 0.1),
                        persen:
                            Math.round((Math.floor(realisasiBelanja * 0.1) / Math.floor(targetBelanja * 0.1)) * 1000) /
                            10,
                        judul: "BIDANG PEMBINAAN KEMASYARAKATAN",
                    },
                     "4": {
                        anggaran: Math.floor(targetBelanja * 0.1).toString(),
                        realisasi: Math.floor(realisasiBelanja * 0.1),
                        persen:
                            Math.round((Math.floor(realisasiBelanja * 0.1) / Math.floor(targetBelanja * 0.1)) * 1000) /
                            10,
                        judul: "BIDANG PEMBERDAYAAN MASYARAKAT",
                    },
                     "5": {
                        anggaran: Math.floor(targetBelanja * 0.1).toString(),
                        realisasi: Math.floor(realisasiBelanja * 0.1),
                        persen:
                            Math.round((Math.floor(realisasiBelanja * 0.1) / Math.floor(targetBelanja * 0.1)) * 1000) /
                            10,
                        judul: "BIDANG PENANGGULANGAN BENCANA, DARURAT DAN MENDESAK DESA",
                    }
                },
                pelaksanaan: {
                     "0": {
                        anggaran: targetPendapatan.toString(),
                        realisasi: realisasiPendapatan,
                        persen: Math.round((realisasiPendapatan / targetPendapatan) * 1000) / 10,
                        judul: "PENDAPATAN",
                    },
                     "1": {
                        anggaran: targetBelanja.toString(),
                        realisasi: realisasiBelanja,
                        persen: Math.round((realisasiBelanja / targetBelanja) * 1000) / 10,
                        judul: "BELANJA",
                    },
                     "2": {
                        anggaran: targetPembiayaan.toString(),
                        realisasi: realisasiPembiayaan,
                        persen:
                            targetPembiayaan === 0
                                ? 0
                                : Math.round((realisasiPembiayaan / targetPembiayaan) * 1000) / 10,
                        judul: "PEMBIAYAAN",
                    }
                },
                laporan: fixedApbdes ? `APBDes ${tahun} (Data Artikel)` : `APBDes ${tahun} (Data Simulasi)`,
            },
        },
    ];

    if (fixedApbdes) {
        return NextResponse.json({
            status: "fixed",
            message: "Data tetap (lokal)",
            data: mockFallbackData,
        });
    }

    const response = await fetchOpenSIDKeuangan(tahun);

    if (!response.success) {
        console.warn(`Keuangan API request failed for ${tahun}, using fallback simulation data`);
        return NextResponse.json({
            status: "partial",
            message: "Data simulasi (API tidak tersedia)",
            data: mockFallbackData,
        });
    }

    return NextResponse.json(response.data);
}
