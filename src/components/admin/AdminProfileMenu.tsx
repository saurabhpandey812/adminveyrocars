"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";

export function AdminProfileMenu({ email, name = "Admin" }: { email: string; name?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="flex h-11 items-center gap-2 border border-line bg-bone px-2 text-sm hover:bg-white"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center bg-ink text-[0.7rem] font-semibold tracking-wide text-bone">
          {initials}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block truncate font-semibold leading-tight">{name}</span>
          <span className="block max-w-[9rem] truncate text-[0.65rem] leading-tight text-mute">{email}</span>
        </span>
        <ChevronDown size={14} className={`hidden text-mute transition sm:block ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account menu"
          className="absolute top-[calc(100%+0.4rem)] right-0 z-50 w-56 overflow-hidden border border-line bg-white shadow-[0_12px_28px_rgba(20,21,23,0.12)]"
        >
          <div className="border-b border-line px-3.5 py-3">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="truncate text-xs text-mute">{email}</p>
          </div>
          <div className="p-1.5">
            <Link
              role="menuitem"
              href="/admin/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-ink hover:bg-bone"
            >
              <User size={16} className="text-mute" aria-hidden />
              Profile
            </Link>
          </div>
          <div className="border-t border-line p-1.5">
            <form action={logoutAction}>
              <button
                role="menuitem"
                type="submit"
                className="flex w-full items-center gap-2.5 px-2.5 py-2 text-sm text-ink hover:bg-bone"
              >
                <LogOut size={16} className="text-mute" aria-hidden />
                Log out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
