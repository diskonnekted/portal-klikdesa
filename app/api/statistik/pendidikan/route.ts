import { NextResponse } from "next/server";
import { fetchOpenSIDStatistikById } from "@/lib/api-helpers";

export async function GET() {
    const response = await fetchOpenSIDStatistikById("8", "pendidikan");

    return NextResponse.json(response.success ? response.data : response);
}
