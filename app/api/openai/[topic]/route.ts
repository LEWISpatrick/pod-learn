import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CohereClient } from "cohere-ai";

// Initialize the Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "",
});

export async function GET(
  request: Request,
  { params }: { params: { topic: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const topic = params.topic;
  const { searchParams } = new URL(request.url);
  const tone = searchParams.get("tone") || "comedy";
  const duration = searchParams.get("duration") || "5";

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `Create a ${duration}-minute ${tone} podcast monologue about ${topic}. Be concise and entertaining. and Only return the content, no other text.`,
      maxTokens: 500,
      temperature: 0.7,
    });

    if (response.generations && response.generations.length > 0) {
      return NextResponse.json({ content: response.generations[0].text });
    } else {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cohere API error:", error);
    return NextResponse.json(
      { error: "Failed to generate podcast content" },
      { status: 500 }
    );
  }
}
