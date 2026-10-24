import "server-only";
import { readDB } from "./db";
import type { Booking, BookingStatus } from "@/types/booking";

const rev = (b: Booking) => b.rentalAmount ?? b.estimatedTotal;
const pct = (cur: number, prev: number) => (prev === 0 ? null : Math.round(((cur - prev) / prev) * 100));

function emptyDashboard() {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleString("en-IN", { month: "short" }), revenue: 0, bookings: 0 };
  });
  const statuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];
  return {
    cars: { total: 0, available: 0 },
    customers: 0,
    outNow: 0,
    pending: 0,
    revenueThisMonth: 0,
    revenueDelta: null as number | null,
    bookingsThisMonth: 0,
    bookingsDelta: null as number | null,
    monthly: months,
    statusCounts: statuses.map((status) => ({ status, count: 0 })),
    topCars: [] as { label: string; value: number }[],
    pendingList: [] as Booking[],
    recent: [] as Booking[],
    carName: (slug: string) => slug,
    hasDemo: false,
  };
}

export async function getDashboard() {
  try {
    const db = await readDB();
    const now = new Date();
    const nowStr = now.toISOString().slice(0, 16);
    const live = db.bookings.filter((b) => b.status !== "cancelled");
    const earned = db.bookings.filter((b) => b.status === "confirmed" || b.status === "completed");
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleString("en-IN", { month: "short" }) };
    });
    const monthly = months.map((m) => ({
      label: m.label,
      revenue: earned.filter((b) => b.pickupAt.startsWith(m.key)).reduce((a, b) => a + rev(b), 0),
      bookings: live.filter((b) => b.pickupAt.startsWith(m.key)).length,
    }));
    const cur = monthly[5],
      prev = monthly[4];
    const statuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];
    const statusCounts = statuses.map((s) => ({ status: s, count: db.bookings.filter((b) => b.status === s).length }));
    const tally = new Map<string, number>();
    live.forEach((b) => tally.set(b.carSlug, (tally.get(b.carSlug) ?? 0) + 1));
    const topCars = [...tally.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([slug, value]) => {
        const c = db.cars.find((x) => x.slug === slug);
        return { label: c ? `${c.brand} ${c.model}` : slug, value };
      });
    const byNewest = [...db.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return {
      cars: { total: db.cars.length, available: db.cars.filter((c) => c.status === "available").length },
      customers: db.customers.length,
      outNow: db.bookings.filter((b) => b.status === "confirmed" && b.pickupAt <= nowStr && b.returnAt >= nowStr).length,
      pending: db.bookings.filter((b) => b.status === "pending").length,
      revenueThisMonth: cur.revenue,
      revenueDelta: pct(cur.revenue, prev.revenue),
      bookingsThisMonth: cur.bookings,
      bookingsDelta: pct(cur.bookings, prev.bookings),
      monthly,
      statusCounts,
      topCars,
      pendingList: byNewest.filter((b) => b.status === "pending").slice(0, 5),
      recent: byNewest.slice(0, 6),
      carName: (slug: string) => {
        const c = db.cars.find((x) => x.slug === slug);
        return c ? `${c.brand} ${c.model}` : slug;
      },
      hasDemo: db.bookings.some((b) => b.demo) || db.customers.some((c) => c.demo),
    };
  } catch (err) {
    console.error("[stats] getDashboard:", err);
    return emptyDashboard();
  }
}
