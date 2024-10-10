import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function GET(
  request: Request,
  { params }: { params: { topic: string } }
) {
  // Check origin
  // const origin = request.headers.get("origin");
  // // if (origin !== process.env.ALLOWED_ORIGIN) {
  // //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // // }

  // Check if the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const topic = params.topic;

  // Get the tone and duration from the query parameters
  const { searchParams } = new URL(request.url);
  const tone = searchParams.get("tone") || "comedy";
  const duration = searchParams.get("duration") || "5"; // Default to 5 if not specified

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
    });

    console.log(completion.choices[0].message.content);

    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate podcast content" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");

  if (origin === process.env.ALLOWED_ORIGIN) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}
