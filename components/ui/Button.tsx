"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

const VARIANTS: Record<string, React.CSSProperties> = {
  primary: { background: "linear-gradient(135deg,#D98236,#A85C20)", color: "#071013", fontWeight: 700 },
  secondary: { background: "#132E35", color: "#F6FAF9", border: "1px solid rgba(179,199,195,0.18)" },
  ghost: { background: "transparent", color: "#B3C7C3", border: "1px solid rgba(179,199,195,0.18)" },
  danger: { background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" },
  success: { background: "rgba(34,197,94,0.15)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.3)" },
  emerald: { background: "linear-gradient(135deg,#2DD4BF,#0F766E)", color: "#071013", fontWeight: 700 },
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({ children, variant = "primary", size = "md", loading, disabled, className, style, ...props }: ButtonProps) {
  const sizeStyles: React.CSSProperties = size === "sm" ? { padding: "6px 14px", fontSize: 13 } : size === "lg" ? { padding: "12px 28px", fontSize: 16 } : { padding: "9px 20px", fontSize: 14 };
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(className)}
      style={{ ...VARIANTS[variant], ...sizeStyles, borderRadius: 8, cursor: disabled || loading ? "not-allowed" : "pointer", opacity: disabled || loading ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.2s, transform 0.1s", border: VARIANTS[variant].border as string ?? "none", ...style }}
      onMouseEnter={(e) => { if (!disabled && !loading) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={(e) => { if (!disabled && !loading) e.currentTarget.style.opacity = "1"; }}
    >
      {loading ? <span style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> : null}
      {children}
    </button>
  );
}
