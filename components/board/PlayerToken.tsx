const PLAYER_COLORS = ["#D98236", "#2DD4BF", "#FBBF24", "#A78BFA"];
const PLAYER_SYMBOLS = ["◆", "●", "▲", "■"];

interface Props { playerIndex: number; size?: number; }

export default function PlayerToken({ playerIndex, size = 14 }: Props) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: PLAYER_COLORS[playerIndex],
      border: "1.5px solid #071013",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.5, color: "#071013", fontWeight: 900,
      boxShadow: `0 0 ${size * 0.4}px ${PLAYER_COLORS[playerIndex]}80`,
      flexShrink: 0,
    }}>
      {PLAYER_SYMBOLS[playerIndex]}
    </div>
  );
}
