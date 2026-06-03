import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const kecamatan = searchParams.get('kecamatan');
        
        if (!kecamatan) {
            return NextResponse.json({ error: "Missing kecamatan parameter" }, { status: 400 });
        }
        
        const url = `https://opendata.banjarnegarakab.go.id/api/desa?kecamatan=${encodeURIComponent(kecamatan)}`;
        
        const response = await fetch(url, {
            next: { revalidate: 86400 } // Cache for 24 hours
        });
        
        if (!response.ok) {
            throw new Error(`OpenData API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching OpenData Desa List:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch data" }, { status: 500 });
    }
}
