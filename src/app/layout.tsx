import type { Metadata } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";

const body = Inter_Tight({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const disp = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-disp", display: "swap" });
export const metadata: Metadata = { title: { default: "VEYRO CARS Admin", template: "%s | VEYRO Admin" }, robots: { index: false, follow: false } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en-IN" className={`${body.variable} ${disp.variable}`}><body>{children}</body></html>);
}
