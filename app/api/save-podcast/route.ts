import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Check origin
  const origin = req.headers.get("origin");
  if (origin !== process.env.ALLOWED_ORIGIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, audioUrl, tone } = await req.json();

  try {
    const savedPodcast = await db.savedPodcast.create({
      data: {
        userId: session.user.id,
        topic,
        audioUrl,
        tone,
      },
    });

    return NextResponse.json(savedPodcast);
  } catch (error) {
    console.error("Error saving podcast:", error);
    return NextResponse.json(
      { error: "Failed to save podcast" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");

  if (origin === process.env.ALLOWED_ORIGIN) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}
