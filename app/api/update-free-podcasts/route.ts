import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  //   const origin = req.headers.get("origin");
  //   if (origin !== process.env.ALLOWED_ORIGIN) {
  //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  //   }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        freePodcasts: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      freePodcastsRemaining: updatedUser.freePodcasts,
    });
  } catch (error) {
    console.error("Error updating free podcasts:", error);
    return NextResponse.json(
      { error: "Failed to update free podcasts" },
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
