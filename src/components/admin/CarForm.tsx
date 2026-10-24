"use client";
import Link from "next/link";
import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { AdminImage } from "@/components/admin/AdminImage";
import { saveCarAction } from "@/server/actions/cars";
import { carStatuses, categories, fuels, transmissions, type CarFormState } from "@/lib/validations/car";
import type { Car } from "@/types/car";

const initial: CarFormState = { errors: {} };
const fieldCls = "field !min-h-9 text-sm";

function Sel({
  id,
  label,
  options,
  defaultValue,
  error,
  className = "",
}: {
  id: string;
  label: string;
  options: readonly string[];
  defaultValue?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label !mb-1 text-xs">
        {label}
      </label>
      <select id={id} name={id} defaultValue={defaultValue} className={`${fieldCls} capitalize`} aria-invalid={!!error}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="err">
          {error}
        </p>
      )}
    </div>
  );
}

function CompactField(props: React.ComponentProps<typeof Field>) {
  return <Field {...props} className={`[&_.label]:!mb-1 [&_.label]:text-xs [&_input]:!min-h-9 [&_input]:text-sm ${props.className ?? ""}`} />;
}

export function CarForm({ car }: { car?: Car }) {
  const [state, action, pending] = useActionState(saveCarAction, initial);
  const e = state.errors;
  return (
    <form action={action} className="grid w-full gap-4">
      {car && <input type="hidden" name="id" value={car.id} />}
      {e.form && (
        <p role="alert" className="err">
          {e.form}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-12">
        {/* Basics — wide */}
        <section className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 xl:col-span-8">
          <h2 className="display col-span-full text-xl">Basics</h2>
          <CompactField id="brand" label="Brand" defaultValue={car?.brand} error={e.brand} placeholder="Hyundai" />
          <CompactField id="model" label="Model" defaultValue={car?.model} error={e.model} placeholder="Creta" />
          <CompactField id="carNumber" label="Car number" defaultValue={car?.carNumber} error={e.carNumber} placeholder="UP32 AB 1234" className="sm:col-span-2" />
          <Sel id="category" label="Category" options={categories} defaultValue={car?.category} error={e.category} />
          <CompactField id="year" label="Year" type="number" defaultValue={car?.year ?? new Date().getFullYear()} error={e.year} />
          <CompactField id="seats" label="Seats" type="number" defaultValue={car?.seats ?? 5} error={e.seats} />
          <Sel id="transmission" label="Transmission" options={transmissions} defaultValue={car?.transmission} error={e.transmission} />
          <Sel id="fuel" label="Fuel" options={fuels} defaultValue={car?.fuel} error={e.fuel} />
        </section>

        {/* Pricing + visibility — side panel */}
        <section className="card grid content-start gap-3 p-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
          <h2 className="display col-span-full text-xl">Pricing & visibility</h2>
          <CompactField id="pricePerDay" label="Price / day (₹)" type="number" defaultValue={car?.pricePerDay} error={e.pricePerDay} />
          <CompactField id="securityDeposit" label="Security deposit (₹)" type="number" defaultValue={car?.securityDeposit} error={e.securityDeposit} />
          <Sel id="status" label="Status" options={carStatuses} defaultValue={car?.status ?? "available"} />
          <label className="flex items-center gap-2 self-end pb-1 text-sm">
            <input type="checkbox" name="featured" defaultChecked={car?.featured} className="accent-brass" /> Featured on website
          </label>
        </section>

        {/* Description + features side by side */}
        <section className="card grid gap-3 p-4 xl:col-span-6">
          <h2 className="display text-xl">Description</h2>
          <div>
            <label htmlFor="description" className="label !mb-1 text-xs">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={car?.description}
              className="field !min-h-0 py-2 text-sm"
              aria-invalid={!!e.description}
            />
            {e.description && (
              <p role="alert" className="err">
                {e.description}
              </p>
            )}
          </div>
        </section>

        <section className="card grid gap-3 p-4 xl:col-span-6">
          <h2 className="display text-xl">Features</h2>
          <div>
            <label htmlFor="features" className="label !mb-1 text-xs">
              One per line
            </label>
            <textarea
              id="features"
              name="features"
              rows={4}
              defaultValue={car?.features.join("\n")}
              className="field !min-h-0 py-2 text-sm"
              placeholder={"Air conditioning\nBluetooth audio"}
            />
          </div>
        </section>

        {/* Photos + actions */}
        <section className="card grid gap-3 p-4 xl:col-span-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <h2 className="display mb-3 text-xl">Photos</h2>
            {car && car.images.length > 0 && (
              <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                {car.images.map((img) => (
                  <li key={img.src}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
                      <AdminImage src={img.src} alt={img.alt} />
                    </div>
                    <label className="mt-1 flex items-center gap-1.5 text-[11px]">
                      <input type="checkbox" name="keep" value={img.src} defaultChecked className="accent-brass" /> Keep
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <label htmlFor="newImages" className="label !mb-1 text-xs">
              Add photos
            </label>
            <input
              id="newImages"
              name="newImages"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="field !min-h-9 py-1.5 text-sm"
            />
            {e.images && (
              <p role="alert" className="err">
                {e.images}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <button className="btn btn-dark !min-h-10 px-5" disabled={pending}>
              {pending ? "Saving…" : car ? "Save changes" : "Add car"}
            </button>
            <Link href="/admin/cars" className="btn btn-ghost !min-h-10 px-5">
              Cancel
            </Link>
          </div>
        </section>
      </div>
    </form>
  );
}
