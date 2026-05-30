import { NextResponse } from "next/server";

// Proxy GenLayer JSON-RPC calls server-side to avoid CORS errors in the browser.
// Configure NEXT_PUBLIC_GENLAYER_RPC_URL=/api/rpc on the client to route through here.

const UPSTREAM = process.env.GENLAYER_RPC_UPSTREAM || "https://studio.genlayer.com/api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Don't cache RPC responses
      cache: "no-store",
    });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32603, message: `Proxy fetch failed: ${msg}` }, id: null },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    upstream: UPSTREAM,
    hint: "POST JSON-RPC payloads here.",
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
