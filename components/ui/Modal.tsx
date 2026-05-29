"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ title, children, onClose, width = 480 }: { title: string; children: React.ReactNode; onClose: () => void; width?: number }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,16,19,0.8)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#0D1F23", border: "1px solid rgba(179,199,195,0.18)", borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid rgba(179,199,195,0.1)" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#F6FAF9" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#77918B", cursor: "pointer", padding: 4, borderRadius: 6, display: "flex" }}><X size={18} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}
