import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Check origin

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
