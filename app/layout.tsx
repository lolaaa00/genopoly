import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Genopoly — Build your empire. Prove every move.",
  description: "Genopoly is a GenLayer-refereed property trading board game where every dice roll, rent payment, auction, trade, upgrade, mortgage, bankruptcy, and winner settlement is verified through an Intelligent Contract.",
  keywords: ["Genopoly", "GenLayer", "blockchain", "board game", "property trading"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 60px)" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
