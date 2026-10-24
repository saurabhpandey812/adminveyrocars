"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarCheck, Car, Globe, LayoutDashboard, LogOut, Menu, Settings, Users, X } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { publicEnv } from "@/config";
import { site } from "@/lib/constants/site";

const items = [
  ["/admin", "Dashboard", LayoutDashboard], ["/admin/cars", "Cars", Car], ["/admin/bookings", "Bookings", CalendarCheck],
  ["/admin/customers", "Customers", Users], ["/admin/settings", "Settings", Settings],
] as const;

export function AdminSidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h: string) => (h === "/admin" ? path === "/admin" : path.startsWith(h));
  const nav = (
    <nav aria-label="Admin" className="grid gap-1">
      {items.map(([h, l, Icon]) => (
        <Link key={h} href={h} onClick={() => setOpen(false)} aria-current={active(h) ? "page" : undefined}
          className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium ${active(h) ? "bg-bone text-ink" : "text-bone/70 hover:text-bone"}`}>
          <Icon size={18} aria-hidden /> {l}
        </Link>
      ))}
    </nav>
  );
  const foot = (
    <div className="mt-auto grid gap-1 border-t border-bone/15 pt-4 text-sm">
      <a href={publicEnv.siteUrl || "/"} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 text-bone/70 hover:text-bone"><Globe size={18} aria-hidden /> View website</a>
      <form action={logoutAction}><button className="flex w-full items-center gap-3 px-3 py-2 text-bone/70 hover:text-bone"><LogOut size={18} aria-hidden /> Log out</button></form>
    </div>
  );
  return (
    <>
      <header className="flex items-center justify-between bg-ink px-4 py-3 text-bone lg:hidden">
        <span className="display text-xl">{site.name} Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </header>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Admin menu" className="fixed inset-0 z-50 flex flex-col gap-6 bg-ink p-5 text-bone lg:hidden">
          <div className="flex items-center justify-between"><span className="display text-xl">Admin</span><button onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div>
          {nav}{foot}
        </div>
      )}
      <aside className="sticky top-0 hidden h-screen flex-col gap-8 bg-ink p-5 text-bone lg:flex">
        <p className="display text-2xl">{site.name}</p>
        {nav}{foot}
      </aside>
    </>
  );
}
