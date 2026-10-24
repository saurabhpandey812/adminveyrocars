import { site } from "@/lib/constants/site";

/** Split-screen auth layout — matches the customer website AuthShell. */
export function AdminAuthShell({
  title,
  intro,
  children,
  eyebrow = site.name,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink lg:block" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/team.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
          <p className="text-sm tracking-[0.2em] text-brass">{site.name}</p>
          <p className="display mt-3 max-w-md text-4xl text-bone xl:text-5xl">Fleet control, made simple.</p>
          <p className="mt-4 max-w-sm text-bone/70">
            Manage cars, bookings and customers from one place — the {site.name} admin desk.
          </p>
        </div>
      </aside>

      <div className="flex min-h-svh items-center bg-bone">
        <div className="mx-auto w-full max-w-md px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-brass-d uppercase">{eyebrow}</p>
          <h1 className="display mt-2 text-4xl sm:text-5xl">{title}</h1>
          <p className="mb-8 mt-3 text-mute">{intro}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
