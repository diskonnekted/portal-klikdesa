import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const kecamatan = searchParams.get('kecamatan');
        const desaId = searchParams.get('desa_id');
        
        if (!kecamatan || !desaId) {
            return NextResponse.json({ error: "Missing kecamatan or desa_id parameter" }, { status: 400 });
        }
        
        const url = `https://opendata.banjarnegarakab.go.id/api/kependudukan?kecamatan=${encodeURIComponent(kecamatan)}&desa_id=${encodeURIComponent(desaId)}`;
        
        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!response.ok) {
            throw new Error(`OpenData API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching OpenData Kependudukan:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch data" }, { status: 500 });
    }
}
