import { cn } from "@/lib/utils";
export default function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn(className)} style={{ background: "#1B3A41", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}
