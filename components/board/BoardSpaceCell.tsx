import type { BoardSpace } from "@/types";

const SPACE_TYPE_COLORS: Record<string, { bg: string; text: string; border?: string }> = {
  start:        { bg: "#2DD4BF", text: "#071013" },
  transit:      { bg: "#0F766E", text: "#A7F3D0" },
  utility:      { bg: "#334155", text: "#94A3B8" },
  tax:          { bg: "#78350F", text: "#FBBF24" },
  market_event: { bg: "#0C4A6E", text: "#38BDF8" },
  city_event:   { bg: "#4C1D95", text: "#A78BFA" },
  lockup:       { bg: "#7F1D1D", text: "#FCA5A5" },
  go_to_lockup: { bg: "#7F1D1D", text: "#FCA5A5" },
  rest:         { bg: "#14532D", text: "#86EFAC" },
  property:     { bg: "#F5E7BE", text: "#071013" },
  fee:          { bg: "#78350F", text: "#FBBF24" },
};

const DISTRICT_COLORS: Record<string, string> = {
  Ember: "#92400E", Jade: "#14B8A6", Coral: "#FB7185", Harbor: "#0EA5E9",
  Ivory: "#E7E5E4", Neon: "#84CC16", Obsidian: "#475569", Crown: "#F59E0B",
};

interface Props { space: BoardSpace; isCorner?: boolean; rotation?: number; }

export default function BoardSpaceCell({ space, isCorner, rotation = 0 }: Props) {
  const typeStyle = SPACE_TYPE_COLORS[space.type] ?? { bg: "#1B3A41", text: "#F6FAF9" };
  const districtColor = space.district ? DISTRICT_COLORS[space.district] : null;

  const isBottomEdge = !isCorner;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: typeStyle.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isCorner ? 9 : 6,
      fontWeight: 700,
      color: typeStyle.text,
      border: "0.5px solid rgba(0,0,0,0.3)",
      position: "relative",
      overflow: "hidden",
      cursor: "inherit",
      transform: rotation ? `rotate(${rotation}deg)` : undefined,
    }}>
      {space.type === "property" && districtColor && isBottomEdge && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "28%", background: districtColor }} />
      )}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "1px 2px", lineHeight: 1.2, maxWidth: "100%" }}>
        {isCorner ? (
          <span style={{ fontSize: 8, fontWeight: 800 }}>{space.name}</span>
        ) : (
          <span style={{ wordBreak: "break-word", hyphens: "auto" }}>{space.name.replace(" ", "\n")}</span>
        )}
        {space.price && !isCorner && (
          <div style={{ fontSize: 5, opacity: 0.8, marginTop: 1 }}>G{space.price}</div>
        )}
      </div>
    </div>
  );
}
