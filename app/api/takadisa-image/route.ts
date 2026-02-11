import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["takadisa.smartdesa.net"]);
const DEFAULT_ORIGIN = "https://takadisa.smartdesa.net";

function resolveAndValidateUrl(raw: string | null): URL | null {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;

    let url: URL;
    try {
        url = trimmed.startsWith("http://") || trimmed.startsWith("https://") ? new URL(trimmed) : new URL(trimmed, DEFAULT_ORIGIN);
    } catch {
        return null;
    }

    if (url.protocol !== "https:") return null;
    if (!ALLOWED_HOSTS.has(url.hostname.toLowerCase())) return null;
    if (!url.pathname.startsWith("/uploads/")) return null;

    return url;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    const targetUrl = resolveAndValidateUrl(urlParam);
    if (!targetUrl) {
        return NextResponse.json({ error: "Invalid image url" }, { status: 400 });
    }

    let upstream: Response;
    try {
        upstream = await fetch(targetUrl.toString(), {
            method: "GET",
            headers: {
                Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
                Referer: `${DEFAULT_ORIGIN}/`,
            },
            next: { revalidate: 60 * 60 },
            signal: AbortSignal.timeout(15000),
        });
    } catch (e) {
        return NextResponse.json({ error: `Fetch failed: ${String(e)}` }, { status: 502 });
    }

    if (!upstream.ok) {
        return NextResponse.json({ error: `Upstream error: ${upstream.status}` }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const cacheControl =
        upstream.headers.get("cache-control") || "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
        status: 200,
        headers: {
            "Content-Type": contentType,
            "Cache-Control": cacheControl,
        },
    });
}

