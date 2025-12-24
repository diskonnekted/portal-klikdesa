import { NextRequest, NextResponse } from "next/server";
import { fetchSDGSDetail } from "@/lib/api-helpers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ goal: string }> }) {
    const { goal: goalId } = await params;
    const { searchParams } = new URL(request.url);
    const locationCode = searchParams.get("location_code") || "33.04.09.2014";

    // Validate goal ID
    if (!goalId || isNaN(parseInt(goalId)) || parseInt(goalId) < 1 || parseInt(goalId) > 18) {
        return NextResponse.json({ error: "Invalid goal ID. Must be between 1 and 18." }, { status: 400 });
    }

    const response = await fetchSDGSDetail(goalId, locationCode);
    if (!response.success) {
        return NextResponse.json(
            { target: [], header: [], recom: [] },
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            }
        );
    }
    return NextResponse.json(response.data, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
