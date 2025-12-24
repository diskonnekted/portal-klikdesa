import { NextResponse } from "next/server";
import { fetchOpenSIDKeuangan } from "@/lib/api-helpers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun") || "2025";
    const yearInt = parseInt(tahun);

    // Generate realistic mock data based on year
    // Base amount ~1.2 Billion IDR with ~5% yearly increase
    const baseAmount = 1200000000;
    const yearlyIncrease = 0.05;
    const yearDiff = yearInt - 2021;
    const factor = Math.pow(1 + yearlyIncrease, Math.max(0, yearDiff));
    
    const targetPendapatan = Math.floor(baseAmount * factor);
    const targetBelanja = Math.floor(targetPendapatan * 0.98); // Surplus ~2%

    const mockFallbackData = [
        {
            type: "apbdes",
            id: "1",
            attributes: {
                tahun: tahun,
                pendapatan: {
                    "0": {
                        anggaran: targetPendapatan.toString(),
                        realisasi: Math.floor(targetPendapatan * 0.95),
                        persen: 95.0,
                        judul: "PENDAPATAN",
                    },
                    "1": {
                        anggaran: Math.floor(targetPendapatan * 0.6).toString(),
                        realisasi: Math.floor(targetPendapatan * 0.6 * 0.95),
                        persen: 95.0,
                        judul: "PENDAPATAN ASLI DESA",
                    },
                    "2": {
                        anggaran: Math.floor(targetPendapatan * 0.4).toString(),
                        realisasi: Math.floor(targetPendapatan * 0.4 * 0.95),
                        persen: 95.0,
                        judul: "PENDAPATAN TRANSFER",
                    }
                },
                belanja: {
                    "0": {
                        anggaran: targetBelanja.toString(),
                        realisasi: Math.floor(targetBelanja * 0.90),
                        persen: 90.0,
                        judul: "BELANJA",
                    },
                    "1": {
                        anggaran: Math.floor(targetBelanja * 0.3).toString(),
                        realisasi: Math.floor(targetBelanja * 0.3 * 0.9),
                        persen: 90.0,
                        judul: "BIDANG PENYELENGGARAAN PEMERINTAHAN DESA",
                    },
                    "2": {
                        anggaran: Math.floor(targetBelanja * 0.4).toString(),
                        realisasi: Math.floor(targetBelanja * 0.4 * 0.9),
                        persen: 90.0,
                        judul: "BIDANG PELAKSANAAN PEMBANGUNAN DESA",
                    },
                     "3": {
                        anggaran: Math.floor(targetBelanja * 0.1).toString(),
                        realisasi: Math.floor(targetBelanja * 0.1 * 0.9),
                        persen: 90.0,
                        judul: "BIDANG PEMBINAAN KEMASYARAKATAN",
                    },
                     "4": {
                        anggaran: Math.floor(targetBelanja * 0.1).toString(),
                        realisasi: Math.floor(targetBelanja * 0.1 * 0.9),
                        persen: 90.0,
                        judul: "BIDANG PEMBERDAYAAN MASYARAKAT",
                    },
                     "5": {
                        anggaran: Math.floor(targetBelanja * 0.1).toString(),
                        realisasi: Math.floor(targetBelanja * 0.1 * 0.9),
                        persen: 90.0,
                        judul: "BIDANG PENANGGULANGAN BENCANA, DARURAT DAN MENDESAK DESA",
                    }
                },
                pelaksanaan: {
                     "0": {
                        anggaran: targetPendapatan.toString(),
                        realisasi: Math.floor(targetPendapatan * 0.95),
                        persen: 95.0,
                        judul: "PENDAPATAN",
                    },
                     "1": {
                        anggaran: targetBelanja.toString(),
                        realisasi: Math.floor(targetBelanja * 0.90),
                        persen: 90.0,
                        judul: "BELANJA",
                    },
                     "2": {
                        anggaran: (targetPendapatan - targetBelanja).toString(),
                        realisasi: Math.floor(targetPendapatan * 0.95) - Math.floor(targetBelanja * 0.90),
                        persen: 100.0,
                        judul: "PEMBIAYAAN",
                    }
                },
                laporan: `APBDes ${tahun} (Data Simulasi)`,
            },
        },
    ];

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
