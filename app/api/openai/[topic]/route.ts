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

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const writeToStream = async (text: string) => {
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
    );
  };

  // Start the stream immediately
  writeToStream("Generating content...");

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `Generate a ${duration}-minute ${tone} podcast monologue about ${topic}. Be concise and entertaining.`,
      maxTokens: 500,
      temperature: 0.7,
    });

    if (response.generations && response.generations.length > 0) {
      await writeToStream(response.generations[0].text);
    } else {
      await writeToStream("No content generated");
    }
  } catch (error) {
    console.error("Cohere API error:", error);
    await writeToStream("Failed to generate podcast content");
  } finally {
    writer.close();
  }

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
