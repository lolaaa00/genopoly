import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) return NextResponse.json({ disputes: [] });
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("disputes").select("*").eq("game_id", gameId);
  return NextResponse.json({ disputes: data ?? [] });
}

export async function POST(req: Request) {
  const body = await req.json() as { gameId: string; wallet: string; reason: string };
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("disputes").insert({ game_id: body.gameId, wallet: body.wallet, reason: body.reason, status: "pending", created_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
