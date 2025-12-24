import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = (searchParams.get("lang") || "id").toLowerCase();
        const allowed = ["id", "en"];
        const chosenLang = allowed.includes(lang) ? lang : "id";

        const rssUrl = `https://www.bmkg.go.id/alerts/nowcast/${chosenLang}/rss.xml`;

        const response = await fetch(rssUrl, {
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0 Safari/537.36",
                Accept: "application/xml,text/xml",
            },
            next: {
                revalidate: 60,
                tags: ["bmkg-nowcast-rss"],
            },
            signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
            return NextResponse.json({ error: `BMKG RSS fetch failed: ${response.status}` }, { status: response.status });
        }

        const xmlText = await response.text();
        return new NextResponse(xmlText, {
            status: 200,
            headers: {
                "Content-Type": "application/xml; charset=utf-8",
                "Cache-Control": "public, max-age=60",
            },
        });
    } catch (error) {
        return NextResponse.json({ error: `Internal server error: ${String(error)}` }, { status: 500 });
    }
}
