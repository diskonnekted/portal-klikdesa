import { NextRequest, NextResponse } from "next/server";
import { fetchIDMData, createApiRouteHandler } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") || "2024";

    const response = await fetchIDMData(year);

    return NextResponse.json(response.success ? response.data : response, {
        status: response.success ? 200 : (response.status || 500),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

// Use the standardized API route handler with CORS support
export const { OPTIONS } = createApiRouteHandler(async () => {
    return NextResponse.json({ success: true });
});
