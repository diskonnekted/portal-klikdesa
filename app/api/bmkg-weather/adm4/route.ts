import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const adm4 = (searchParams.get("adm4") || "").trim();
        if (!adm4) {
            return NextResponse.json({ success: false, error: "Parameter 'adm4' wajib diisi" }, { status: 400 });
        }

        const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(adm4)}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0 Safari/537.36",
                Accept: "application/json",
            },
            next: {
                revalidate: 60,
                tags: ["bmkg-weather-adm4", `bmkg-weather-adm4-${adm4}`],
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

