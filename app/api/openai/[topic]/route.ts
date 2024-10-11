import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
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

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates a ${duration}-minute ${tone} podcast monologue about the given topic. The speaker should explain the topic in a friendly, casual way, keeping it entertaining and appropriate for the specified tone.`,
        },
        {
          role: "user",
          content: `Create a ${duration}-minute ${tone} podcast monologue about ${topic}. The speaker should explain the topic in a friendly, casual way, adapting the content and style to fit a ${tone} tone.`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        await writeToStream(content);
      }
    }

    writer.close();
  } catch (error) {
    console.error("OpenAI API error:", error);
    await writeToStream("Error: Failed to generate podcast content");
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
