"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Car, LayoutDashboard, LogOut, User, Users, X } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { site } from "@/lib/constants/site";

const groups = [
  {
    label: "Home",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Fleet",
    items: [
      { href: "/admin/cars", label: "Cars", icon: Car },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/admin/profile", label: "Profile", icon: User }],
  },
] as const;

export function AdminSidebar({
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
}: {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const path = usePathname();
  const active = (href: string, exact?: boolean) => (exact ? path === href : path === href || path.startsWith(`${href}/`));

  function Nav({ iconOnly = false }: { iconOnly?: boolean }) {
    return (
      <div className={`grid ${iconOnly ? "gap-3" : "gap-5"}`}>
        {groups.map((g) => (
          <div key={g.label}>
            {!iconOnly && (
              <p className="mb-2 px-3 text-[0.65rem] font-semibold tracking-[0.16em] text-bone/40 uppercase">{g.label}</p>
            )}
            <nav aria-label={g.label} className="grid gap-0.5">
              {g.items.map(({ href, label, icon: Icon, ...rest }) => {
                const exact = "exact" in rest && rest.exact;
                const on = active(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    title={label}
                    onClick={onCloseMobile}
                    aria-current={on ? "page" : undefined}
                    aria-label={label}
                    className={`relative flex items-center rounded-sm text-sm font-medium transition-colors ${
                      iconOnly ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
                    } ${on ? "bg-bone/12 text-bone" : "text-bone/65 hover:bg-bone/8 hover:text-bone"}`}
                  >
                    {on && !iconOnly && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brass" aria-hidden />}
                    {on && iconOnly && <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-brass" aria-hidden />}
                    <Icon size={18} aria-hidden />
                    {!iconOnly && label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    );
  }

  const brandFull = (
    <div className="px-1">
      <p className="display text-2xl tracking-wide text-bone">{site.name}</p>
      <span className="mt-2 inline-flex rounded-full border border-brass/40 bg-brass/15 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-brass uppercase">
        Admin
      </span>
    </div>
  );

  const brandIcon = (
    <div className="grid place-items-center" title={site.name}>
      <span className="grid h-10 w-10 place-items-center border border-brass/40 bg-brass/15 text-sm font-semibold text-brass">V</span>
    </div>
  );

  function Foot({ iconOnly = false }: { iconOnly?: boolean }) {
    return (
      <div className={`mt-auto border-t border-bone/10 pt-4 ${iconOnly ? "flex justify-center" : ""}`}>
        <form action={logoutAction}>
          <button
            type="submit"
            title="Log out"
            aria-label="Log out"
            className={`flex items-center rounded-sm text-sm text-bone/65 hover:bg-bone/8 hover:text-bone ${
              iconOnly ? "justify-center px-2 py-2.5" : "w-full gap-3 px-3 py-2.5"
            }`}
          >
            <LogOut size={18} aria-hidden />
            {!iconOnly && "Log out"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      {mobileOpen && (
        <div role="dialog" aria-modal="true" aria-label="Admin menu" className="fixed inset-0 z-50 flex flex-col gap-6 bg-ink p-5 text-bone lg:hidden">
          <div className="flex items-start justify-between gap-3">
            {brandFull}
            <button type="button" onClick={onCloseMobile} aria-label="Close menu" className="grid h-10 w-10 place-items-center">
              <X />
            </button>
          </div>
          <Nav />
          <Foot />
        </div>
      )}

      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-ink text-bone transition-[width] duration-200 lg:flex ${
          collapsed ? "w-[4.5rem] items-center gap-6 px-2 py-5" : "w-[15.5rem] gap-8 p-5"
        }`}
      >
        {collapsed ? brandIcon : brandFull}
        <Nav iconOnly={collapsed} />
        <Foot iconOnly={collapsed} />
      </aside>
    </>
  );
}
