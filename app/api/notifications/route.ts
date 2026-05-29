import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ notifications: [] });
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("notifications").select("*").eq("wallet", wallet).order("created_at", { ascending: false }).limit(30);
  return NextResponse.json({ notifications: data ?? [] });
}
