import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("rooms")
    .select("*, room_players(count)")
    .eq("status", "waiting")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ rooms: [] }, { status: 200 });
  const rooms = (data ?? []).map((r) => ({
    id: r.id,
    creatorWallet: r.creator_wallet,
    genlayerGameId: r.genlayer_game_id,
    maxPlayers: r.max_players,
    isPublic: r.is_public,
    status: r.status,
    createdAt: r.created_at,
    playerCount: Array.isArray(r.room_players) ? r.room_players.length : 0,
  }));
  return NextResponse.json({ rooms });
}

export async function POST(req: Request) {
  const body = await req.json() as { genlayerGameId: string; creatorWallet: string; maxPlayers: number; isPublic: boolean };
  const { genlayerGameId, creatorWallet, maxPlayers, isPublic } = body;

  if (!genlayerGameId || !creatorWallet) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: room, error } = await supabase
    .from("rooms")
    .insert({ genlayer_game_id: genlayerGameId, creator_wallet: creatorWallet, max_players: maxPlayers ?? 4, is_public: isPublic ?? true, status: "waiting" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("room_players").insert({ room_id: room.id, wallet: creatorWallet, is_ready: false, player_index: 0 });

  return NextResponse.json({ roomId: room.id, room });
}
