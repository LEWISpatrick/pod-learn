import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
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
