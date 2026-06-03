import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const resourceId = searchParams.get('resource_id');
        
        if (!resourceId) {
            return NextResponse.json({ error: "Missing resource_id parameter" }, { status: 400 });
        }
        
        const url = `https://opendata.banjarnegarakab.go.id/api/3/action/datastore_search?resource_id=${resourceId}&limit=150`;
        
        // Fetch from OpenData CKAN (server-side to bypass CORS)
        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!response.ok) {
            throw new Error(`OpenData API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching OpenData Desa Stunting:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch data" }, { status: 500 });
    }
}
