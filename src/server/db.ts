import "server-only";
import type { Car } from "@/types/car";
import type { Booking } from "@/types/booking";
import type { Customer } from "@/types/customer";
import { seedCars } from "@/data/seed-cars";
import { seedBookings } from "./seed";
import { connectDB } from "./mongo";
import { CarModel } from "./models/car";
import { BookingModel } from "./models/booking";
import { CustomerModel } from "./models/customer";

export interface DB {
  cars: Car[];
  bookings: Booking[];
  customers: Customer[];
}

declare global {
  // eslint-disable-next-line no-var
  var __veyroSeeded: boolean | undefined;
  // eslint-disable-next-line no-var
  var __veyroBackfilled: boolean | undefined;
}

function strip<T extends { id: string }>(doc: T & { _id?: unknown; __v?: unknown }): T {
  const { _id: _a, __v: _b, ...rest } = doc as T & { _id?: unknown; __v?: unknown };
  return rest as T;
}

async function ensureSeeded() {
  if (global.__veyroSeeded) return;
  try {
    const count = await CarModel.countDocuments();
    if (count > 0) {
      global.__veyroSeeded = true;
      return;
    }
    const { customers, bookings } = seedBookings(seedCars);
    await CarModel.insertMany(seedCars);
    if (customers.length) await CustomerModel.insertMany(customers);
    if (bookings.length) await BookingModel.insertMany(bookings);
    global.__veyroSeeded = true;
  } catch (err) {
    console.error("[db] ensureSeeded:", err);
  }
}

async function backfillCarNumbers() {
  if (global.__veyroBackfilled) return;
  try {
    const missing = await CarModel.find({
      $or: [{ carNumber: { $exists: false } }, { carNumber: "" }, { carNumber: null }],
    }).lean();
    if (!missing.length) {
      global.__veyroBackfilled = true;
      return;
    }
    await Promise.all(
      missing.map((c, i) => {
        const fromSeed = seedCars.find((s) => s.id === c.id || s.slug === c.slug);
        const carNumber = fromSeed?.carNumber ?? `UP32 CA ${String(i + 1).padStart(4, "0")}`;
        return CarModel.updateOne({ id: c.id }, { $set: { carNumber } });
      }),
    );
    global.__veyroBackfilled = true;
  } catch (err) {
    console.error("[db] backfillCarNumbers:", err);
  }
}

export async function readDB(): Promise<DB> {
  await connectDB();
  await ensureSeeded();
  await backfillCarNumbers();
  const [cars, bookings, customers] = await Promise.all([
    CarModel.find().lean(),
    BookingModel.find().lean(),
    CustomerModel.find().lean(),
  ]);
  return {
    cars: cars.map((c) => {
      const car = strip(c as unknown as Car);
      return { ...car, carNumber: car.carNumber || "—" };
    }),
    bookings: bookings.map((b) => strip(b as unknown as Booking)),
    customers: customers.map((c) => strip(c as unknown as Customer)),
  };
}

/** Safe read for UI pages — never throws; returns empty only if connect truly fails. */
export async function readDBSafe(): Promise<DB & { ok: boolean; error?: string }> {
  try {
    const db = await readDB();
    return { ...db, ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database unavailable";
    console.error("[db] readDBSafe:", err);
    return { cars: [], bookings: [], customers: [], ok: false, error: message };
  }
}

export async function writeDB(db: DB) {
  await connectDB();
  await Promise.all([CarModel.deleteMany({}), BookingModel.deleteMany({}), CustomerModel.deleteMany({})]);
  if (db.cars.length) await CarModel.insertMany(db.cars);
  if (db.bookings.length) await BookingModel.insertMany(db.bookings);
  if (db.customers.length) await CustomerModel.insertMany(db.customers);
}

export async function updateDB(fn: (db: DB) => void | Promise<void>) {
  const db = await readDB();
  await fn(db);
  await writeDB(db);
}

export async function upsertCar(car: Car) {
  await connectDB();
  await CarModel.findOneAndUpdate({ id: car.id }, car, { upsert: true, new: true, setDefaultsOnInsert: true });
}

export async function setCarStatus(id: string, status: Car["status"]) {
  await connectDB();
  await CarModel.updateOne({ id }, { $set: { status } });
}

export async function deleteCar(id: string) {
  await connectDB();
  await CarModel.deleteOne({ id });
}

export async function setBookingStatus(id: string, status: Booking["status"]) {
  await connectDB();
  const res = await BookingModel.updateOne({ id }, { $set: { status } });
  if (res.matchedCount === 0) throw new Error(`Booking not found: ${id}`);
}

export async function clearDemoData() {
  await connectDB();
  await Promise.all([BookingModel.deleteMany({ demo: true }), CustomerModel.deleteMany({ demo: true })]);
}
