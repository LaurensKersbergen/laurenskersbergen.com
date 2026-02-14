import { NextResponse } from "next/server";
import { getRecentlyPlayed } from "@/lib/spotify";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const tracks = await getRecentlyPlayed(50);

    return NextResponse.json(
      { tracks },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching recently played:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently played tracks" },
      { status: 500 }
    );
  }
}
