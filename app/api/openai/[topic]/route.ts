import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  timeout: 60000, // 60 seconds timeout
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function retryOpenAICall(
  fn: () => Promise<OpenAIResponse>
): Promise<OpenAIResponse> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === MAX_RETRIES - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
  throw new Error("Max retries reached");
}

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
    const completion = await retryOpenAICall(
      () =>
        client.chat.completions.create({
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
        }) as Promise<OpenAIResponse>
    );

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
