"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe, Menu, Search } from "lucide-react";
import { publicEnv } from "@/config";
import { AdminProfileMenu } from "./AdminProfileMenu";

export function AdminTopBar({
  collapsed,
  onToggleSidebar,
  onOpenMobile,
  adminEmail,
  adminName,
}: {
  collapsed?: boolean;
  onToggleSidebar?: () => void;
  onOpenMobile?: () => void;
  adminEmail: string;
  adminName: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function search(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/admin/cars?q=${encodeURIComponent(term)}`);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white px-4 lg:h-[4.25rem] lg:px-6">
      {/* Mobile: open full drawer */}
      <button
        type="button"
        onClick={onOpenMobile}
        className="grid h-11 w-11 shrink-0 place-items-center border border-line text-ink lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop: collapse sidebar to icons-only */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="hidden h-11 w-11 shrink-0 place-items-center border border-line text-ink hover:bg-bone lg:grid"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-pressed={collapsed}
      >
        <Menu size={20} />
      </button>

      <form onSubmit={search} className="relative min-w-0 flex-1 max-w-xl">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-mute" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search cars, bookings, customers…"
          aria-label="Search"
          className="field !h-11 !min-h-11 w-full !pl-11 text-sm"
        />
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <a
          href={publicEnv.siteUrl || "/"}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost !min-h-11 hidden gap-2 px-3 text-sm sm:inline-flex"
        >
          <Globe size={16} aria-hidden /> View website
        </a>
        <AdminProfileMenu email={adminEmail} name={adminName} />
      </div>
    </header>
  );
}
