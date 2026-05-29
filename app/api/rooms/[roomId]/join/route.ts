import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const body = await req.json() as { wallet: string };
  const { wallet } = body;

  if (!wallet) return NextResponse.json({ error: "Missing wallet" }, { status: 400 });

  const supabase = getSupabaseAdmin();

  // Check room exists and is not full
  const { data: room } = await supabase.from("rooms").select("*, room_players(count)").eq("id", roomId).single();
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const { count } = await supabase.from("room_players").select("*", { count: "exact" }).eq("room_id", roomId);
  if ((count ?? 0) >= room.max_players) return NextResponse.json({ error: "Room is full" }, { status: 400 });

  // Check if already joined
  const { data: existing } = await supabase.from("room_players").select("id").eq("room_id", roomId).eq("wallet", wallet).single();
  if (existing) return NextResponse.json({ success: true, alreadyJoined: true });

  const { error } = await supabase.from("room_players").insert({ room_id: roomId, wallet, is_ready: false, player_index: count ?? 0 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
