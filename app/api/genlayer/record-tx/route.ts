import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json() as { gameId: string; wallet: string; action: string; txHash?: string; details?: Record<string, unknown> };
  const { gameId, wallet, action, txHash, details } = body;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("transactions").insert({ game_id: gameId, wallet, action, tx_hash: txHash, details, created_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
