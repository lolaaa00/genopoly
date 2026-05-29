import { cn } from "@/lib/utils";
const VARIANTS: Record<string, { bg: string; color: string }> = {
  default: { bg: "#244B52", color: "#F6FAF9" },
  copper: { bg: "rgba(217,130,54,0.15)", color: "#D98236" },
  success: { bg: "rgba(34,197,94,0.15)", color: "#22C55E" },
  warning: { bg: "rgba(251,191,36,0.15)", color: "#FBBF24" },
  danger: { bg: "rgba(239,68,68,0.15)", color: "#EF4444" },
  info: { bg: "rgba(56,189,248,0.15)", color: "#38BDF8" },
};
export default function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: string; className?: string }) {
  const v = VARIANTS[variant] ?? VARIANTS.default;
  return (
    <span className={cn(className)} style={{ background: v.bg, color: v.color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, display: "inline-block", letterSpacing: "0.02em" }}>
      {children}
    </span>
  );
}
