import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Add CORS protection
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");

  if (origin === process.env.ALLOWED_ORIGIN) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}
