"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CloudSun, Moon, Plus, Sun } from "lucide-react";

function parts(now = new Date()) {
  const h = now.getHours();
  const hello = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const Icon = h < 12 ? Sun : h < 17 ? CloudSun : Moon;
  const date = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  return { hello, Icon, date };
}

export function WelcomeBanner({ name = "Admin" }: { name?: string }) {
  const [g, setG] = useState(() => parts());
  useEffect(() => {
    setG(parts());
    const id = setInterval(() => setG(parts()), 60_000);
    return () => clearInterval(id);
  }, []);
  const { hello, Icon, date } = g;
  return (
    <section className="mb-5 flex flex-col gap-4 bg-ink px-5 py-6 text-bone sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-7">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center bg-ink-2 text-brass" aria-hidden>
          <Icon size={24} strokeWidth={1.6} />
        </div>
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-bone/55 uppercase">Welcome back!</p>
          <h1 className="display mt-1 text-3xl sm:text-4xl">
            {hello}, <span className="text-brass">{name}</span>
          </h1>
          <p className="mt-1 text-sm text-bone/55" suppressHydrationWarning>
            {date}
          </p>
        </div>
      </div>
      <Link href="/admin/cars/new" className="btn btn-primary shrink-0 gap-2 self-start sm:self-center">
        <Plus size={16} aria-hidden /> Add car
      </Link>
    </section>
  );
}
