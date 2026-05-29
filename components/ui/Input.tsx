import { InputHTMLAttributes } from "react";
export default function Input({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: "#B3C7C3" }}>{label}</label>}
      <input {...props} style={{ background: "#071013", border: `1px solid ${error ? "#EF4444" : "rgba(179,199,195,0.18)"}`, borderRadius: 8, padding: "9px 14px", color: "#F6FAF9", fontSize: 14, outline: "none", width: "100%", ...props.style }} />
      {error && <span style={{ fontSize: 12, color: "#EF4444" }}>{error}</span>}
    </div>
  );
}
