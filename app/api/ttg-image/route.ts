import { NextResponse } from "next/server";
import https from "https";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    if (!urlParam) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    let targetUrl: URL;
    try {
        targetUrl = new URL(urlParam);
        if (targetUrl.hostname !== "ttg.pondokrejo.id") {
            return NextResponse.json({ error: "Invalid hostname" }, { status: 400 });
        }
    } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    return new Promise<Response>((resolve) => {
        const options = {
            rejectUnauthorized: false, // Ignore expired certificate error
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
            },
        };

        https
            .get(targetUrl.toString(), options, (res) => {
                if (res.statusCode !== 200) {
                    resolve(NextResponse.json({ error: `Upstream status ${res.statusCode}` }, { status: 502 }));
                    return;
                }

                const contentType = res.headers["content-type"] || "image/jpeg";
                const chunks: Buffer[] = [];

                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => {
                    const buffer = Buffer.concat(chunks);
                    resolve(
                        new Response(buffer, {
                            status: 200,
                            headers: {
                                "Content-Type": contentType,
                                "Cache-Control": "public, max-age=86400, s-maxage=86400",
                            },
                        })
                    );
                });

                res.on("error", (err) => {
                    resolve(NextResponse.json({ error: `Stream error: ${err.message}` }, { status: 500 }));
                });
            })
            .on("error", (err) => {
                resolve(NextResponse.json({ error: `Connection failed: ${err.message}` }, { status: 502 }));
            });
    });
}
