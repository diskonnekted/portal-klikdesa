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
            console.warn(`OpenData API responded with status ${response.status} for kecamatan ${kecamatan}. Returning empty array fallback.`);
            return NextResponse.json([]);
        }
        
        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching OpenData Desa List:", error);
        // Return empty array on failure so client hooks can handle it gracefully without console errors
        return NextResponse.json([]);
    }
}
