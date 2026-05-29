import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ games: [] });

  const games = (data ?? []).map((g) => ({
    id: g.id,
    genlayerGameId: g.genlayer_game_id,
    players: g.players ?? [],
    winner: g.winner,
    moveCount: g.move_count ?? 0,
    status: g.status,
    createdAt: g.created_at,
    completedAt: g.completed_at,
  }));

  return NextResponse.json({ games });
}
