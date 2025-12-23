import { NextRequest, NextResponse } from "next/server";
import { fetchSDGSData, createApiRouteHandler } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const locationCode = searchParams.get("location_code") || "33.04.09.2014";

    const response = await fetchSDGSData(locationCode);

    return NextResponse.json(response.success ? response.data : response, {
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
