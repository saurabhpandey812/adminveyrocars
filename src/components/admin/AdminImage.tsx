"use client";
import { useState } from "react";
import { publicEnv } from "@/config";

/**
 * Prefer local admin `/public` assets. Fallback to customer site URL
 * (NEXT_PUBLIC_SITE_URL) if the local file is missing.
 */
export function AdminImage({ src, alt }: { src: string; alt: string }) {
  const [step, setStep] = useState<"local" | "remote" | "gone">("local");
  if (step === "gone" || !src) {
    return <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center bg-ink-2 text-xs text-bone/60">No image</div>;
  }
  const site = publicEnv.siteUrl;
  const url =
    step === "remote" && site && !src.startsWith("http") && !src.startsWith("/uploads/")
      ? `${site}${src}`
      : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setStep((s) => (s === "local" && site && !src.startsWith("/uploads/") ? "remote" : "gone"))}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
