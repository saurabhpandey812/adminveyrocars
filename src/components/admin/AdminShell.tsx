"use client";
import { useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

const KEY = "veyro-admin-sidebar-collapsed";

export function AdminShell({
  children,
  adminEmail,
  adminName,
}: {
  children: React.ReactNode;
  adminEmail: string;
  adminName: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#eeebe5] lg:flex">
      <AdminSidebar collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar
          collapsed={collapsed}
          onToggleSidebar={toggleCollapsed}
          onOpenMobile={() => setMobileOpen(true)}
          adminEmail={adminEmail}
          adminName={adminName}
        />
        <main className="min-w-0 flex-1 p-4 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
