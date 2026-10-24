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

const EMPTY: DB = { cars: [], bookings: [], customers: [] };

async function ensureSeeded() {
  if (global.__veyroSeeded) return;
  const count = await CarModel.countDocuments().maxTimeMS(4000);
  if (count > 0) {
    global.__veyroSeeded = true;
    return;
  }
  const { customers, bookings } = seedBookings(seedCars);
  await CarModel.insertMany(seedCars);
  if (customers.length) await CustomerModel.insertMany(customers);
  if (bookings.length) await BookingModel.insertMany(bookings);
  global.__veyroSeeded = true;
}

async function backfillCarNumbers() {
  if (global.__veyroBackfilled) return;
  const missing = await CarModel.find({
    $or: [{ carNumber: { $exists: false } }, { carNumber: "" }, { carNumber: null }],
  })
    .maxTimeMS(4000)
    .lean();
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
}

export async function readDB(): Promise<DB> {
  try {
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
  } catch (err) {
    console.error("[db] readDB:", err);
    return EMPTY;
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
  await BookingModel.updateOne({ id }, { $set: { status } });
}

export async function clearDemoData() {
  await connectDB();
  await Promise.all([BookingModel.deleteMany({ demo: true }), CustomerModel.deleteMany({ demo: true })]);
}
