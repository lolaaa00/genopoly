import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json() as { gameId: string; gameState: Record<string, unknown> };
  const { gameId, gameState } = body;
  if (!gameId || !gameState) return NextResponse.json({ error: "Missing gameId or gameState" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("games")
    .upsert({ genlayer_game_id: gameId, cached_state: gameState, status: gameState.status as string, updated_at: new Date().toISOString() }, { onConflict: "genlayer_game_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
