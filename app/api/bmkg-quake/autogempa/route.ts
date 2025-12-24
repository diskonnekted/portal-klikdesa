import { NextResponse } from "next/server";

export async function GET() {
    try {
        const url = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json";
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0 Safari/537.36",
                Accept: "application/json",
            },
            next: {
                revalidate: 60,
                tags: ["bmkg-quake-autogempa"],
            },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) {
            return NextResponse.json({ success: false, error: `BMKG fetch failed ${res.status}` }, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json({ success: true, data });
    } catch (e) {
        return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
    }
}
