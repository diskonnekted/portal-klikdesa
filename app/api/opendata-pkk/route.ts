import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const url = "https://opendata.banjarnegarakab.go.id/api/3/action/datastore_search?resource_id=8de567d6-b51e-402f-9ff6-7fda822a72e9&limit=100";
        
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
        console.error("Error fetching OpenData PKK:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch data" }, { status: 500 });
    }
}
