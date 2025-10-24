import { NextRequest, NextResponse } from "next/server";

const FD_BASE = "https://api.football-data.org/v4";

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  try {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    const { slug } = await context.params;
    const path = slug?.join("/") ?? "";
    const url = `${FD_BASE}/${path}${req.nextUrl.search}`;

    const res = await fetch(url, {
      headers: apiKey ? { "X-Auth-Token": apiKey } : undefined,
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API request failed: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Log matches data for debugging score issues
    if (path.includes("matches") && data.matches) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finishedWithoutScores = data.matches.filter((m: any) => 
        ["FINISHED", "AWARDED"].includes(m.status) && 
        (m.score?.fullTime?.home === null || m.score?.fullTime?.away === null)
      );
      if (finishedWithoutScores.length > 0) {
        console.warn(`Found ${finishedWithoutScores.length} finished matches without scores`, 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          finishedWithoutScores.map((m: any) => ({
            id: m.id,
            home: m.homeTeam?.name,
            away: m.awayTeam?.name,
            status: m.status,
            score: m.score
          }))
        );
      }
    }
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        // Reduce cache for matches to get fresher data
        "cache-control": path.includes("matches") ? "public, max-age=15" : "public, max-age=30",
      },
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


