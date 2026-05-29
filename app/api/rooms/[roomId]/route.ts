import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const supabase = getSupabaseAdmin();

  const [{ data: roomData }, { data: players }] = await Promise.all([
    supabase.from("rooms").select("*").eq("id", roomId).single(),
    supabase.from("room_players").select("*").eq("room_id", roomId).order("player_index"),
  ]);

  if (!roomData) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const room = {
    id: roomData.id,
    creatorWallet: roomData.creator_wallet,
    genlayerGameId: roomData.genlayer_game_id,
    maxPlayers: roomData.max_players,
    isPublic: roomData.is_public,
    status: roomData.status,
    createdAt: roomData.created_at,
    playerCount: players?.length ?? 0,
  };

  const roomPlayers = (players ?? []).map((p) => ({
    roomId: p.room_id,
    wallet: p.wallet,
    username: p.username,
    isReady: p.is_ready,
    joinedAt: p.joined_at,
    playerIndex: p.player_index,
  }));

  return NextResponse.json({ room, players: roomPlayers });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const body = await req.json() as { status: string };
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("rooms").update({ status: body.status }).eq("id", roomId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
