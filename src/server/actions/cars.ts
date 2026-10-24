"use server";
import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/admin";
import { revalidateSite } from "@/server/revalidate";
import { deleteCar, readDB, setCarStatus, upsertCar } from "@/server/db";
import { carStatuses, parseCarForm, type CarFormState } from "@/lib/validations/car";
import { uniqueSlug } from "@/lib/utils/slug";
import { env } from "@/config";
import type { Car, CarStatus } from "@/types/car";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
// Default: admin's own public folder (standalone). Optionally point at verocars/public later via CUSTOMER_PUBLIC_DIR.
const PUBLIC_DIR = env.customerPublicDir || path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads", "cars");
const PLACEHOLDER = "/images/cars/placeholder.jpg";

export async function saveCarAction(_: CarFormState, fd: FormData): Promise<CarFormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const { errors, data } = parseCarForm(fd);
  const files = fd.getAll("newImages").filter((f): f is File => f instanceof File && f.size > 0);
  for (const f of files) {
    if (!TYPES[f.type]) errors.images = "Photos must be JPG, PNG, WebP or AVIF.";
    else if (f.size > 5 * 1024 * 1024) errors.images = "Each photo must be under 5 MB.";
  }
  const db = await readDB();
  const existing = id ? db.cars.find((c) => c.id === id) : undefined;
  if (id && !existing) errors.form = "This car no longer exists.";
  const keep = new Set(fd.getAll("keep").map(String));
  const kept = existing ? existing.images.filter((i) => keep.has(i.src)) : [];
  if (kept.length + files.length > 8) errors.images = "A car can have at most 8 photos.";
  if (Object.keys(errors).length) return { errors };

  const slug = existing?.slug ?? uniqueSlug(`${data.brand} ${data.model}`, db.cars.map((c) => c.slug));
  const alt = `${data.brand} ${data.model} self-drive rental car`;
  const saved: { src: string; alt: string }[] = [];
  if (files.length) await fs.mkdir(UPLOAD_DIR, { recursive: true });
  for (const [i, f] of files.entries()) {
    const name = `${slug}-${Date.now()}-${i}.${TYPES[f.type]}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await f.arrayBuffer()));
    saved.push({ src: `/uploads/cars/${name}`, alt });
  }
  const images = [...kept.map((i) => ({ ...i, alt })), ...saved];
  const car: Car = {
    ...data,
    id: existing?.id ?? `car_${Date.now().toString(36)}`,
    slug,
    images: images.length ? images : [{ src: PLACEHOLDER, alt }],
  };

  if (existing) {
    const dropped = existing.images.filter((i) => !keep.has(i.src) && i.src.startsWith("/uploads/cars/"));
    await Promise.all(dropped.map((i) => fs.unlink(path.join(PUBLIC_DIR, i.src)).catch(() => {})));
  }
  await upsertCar(car);
  revalidatePath("/", "layout");
  await revalidateSite();
  redirect("/admin/cars?saved=1");
}

export async function setCarStatusAction(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? ""),
    status = String(fd.get("status") ?? "") as CarStatus;
  if (!carStatuses.includes(status)) return;
  await setCarStatus(id, status);
  revalidatePath("/", "layout");
  await revalidateSite();
}

export async function deleteCarAction(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const db = await readDB();
  const car = db.cars.find((c) => c.id === id);
  if (!car) return;
  if (db.bookings.some((b) => b.carSlug === car.slug && (b.status === "pending" || b.status === "confirmed"))) {
    redirect("/admin/cars?error=has-bookings");
  }
  await Promise.all(
    car.images.filter((i) => i.src.startsWith("/uploads/cars/")).map((i) => fs.unlink(path.join(PUBLIC_DIR, i.src)).catch(() => {})),
  );
  await deleteCar(id);
  revalidatePath("/", "layout");
  await revalidateSite();
  redirect("/admin/cars?deleted=1");
}
