import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("leaderboard").select("*").order("wins", { ascending: false }).limit(50);
  return NextResponse.json({ leaderboard: data ?? [] });
}
