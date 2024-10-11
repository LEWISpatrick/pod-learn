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
      model: "gpt-3.5-turbo", // Using a faster model to reduce timeout risk
      messages: [
        {
          role: "system",
          content: `Generate a ${duration}-minute ${tone} podcast monologue about ${topic}. Be concise and entertaining.`,
        },
        {
          role: "user",
          content: `Create a brief ${duration}-minute ${tone} podcast monologue about ${topic}.`,
        },
      ],
      max_tokens: 500, // Reduced token count for faster response
      temperature: 0.7,
      stream: true,
    });

    let fullContent = "";
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullContent += content;
        await writeToStream(content);
      }
    }

    // If the stream ends prematurely, send the full content
    if (fullContent.length < 100) {
      await writeToStream(fullContent);
    }

    writer.close();
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);
    await writeToStream(
      `Error: ${
        error instanceof Error
          ? error.message
          : "Failed to generate podcast content"
      }`
    );
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
