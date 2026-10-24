import type { Car, CarCategory, CarStatus, FuelType, Transmission } from "@/types/car";

export const categories: CarCategory[] = ["Hatchback", "Sedan", "SUV", "Premium"];
export const transmissions: Transmission[] = ["Manual", "Automatic"];
export const fuels: FuelType[] = ["Petrol", "Diesel", "CNG", "Electric"];
export const carStatuses: CarStatus[] = ["available", "unavailable", "maintenance"];

export type CarFormErrors = Partial<Record<"brand" | "model" | "carNumber" | "category" | "year" | "seats" | "transmission" | "fuel" | "pricePerDay" | "securityDeposit" | "description" | "images" | "form", string>>;
export type CarFormState = { errors: CarFormErrors };
export type CarInput = Pick<Car, "brand" | "model" | "carNumber" | "category" | "year" | "seats" | "transmission" | "fuel" | "pricePerDay" | "securityDeposit" | "description" | "features" | "status"> & { featured: boolean };

/** Normalise Indian plate input: UP32AB1234 → UP32 AB 1234 */
export function formatCarNumber(raw: string) {
  const c = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (c.length < 8) return raw.toUpperCase().trim();
  const state = c.slice(0, 2);
  const rto = c.slice(2, 4);
  const series = c.slice(4, c.length - 4);
  const num = c.slice(-4);
  return `${state}${rto} ${series} ${num}`.replace(/\s+/g, " ").trim();
}

export function parseCarForm(fd: FormData): { errors: CarFormErrors; data: CarInput } {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  const n = (k: string) => Number(s(k));
  const data: CarInput = {
    brand: s("brand"),
    model: s("model"),
    carNumber: formatCarNumber(s("carNumber")),
    category: s("category") as CarCategory,
    year: n("year"),
    seats: n("seats"),
    transmission: s("transmission") as Transmission,
    fuel: s("fuel") as FuelType,
    pricePerDay: n("pricePerDay"),
    securityDeposit: n("securityDeposit"),
    description: s("description"),
    features: s("features").split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 30),
    status: s("status") as CarStatus,
    featured: fd.get("featured") === "on",
  };
  const e: CarFormErrors = {};
  if (!data.brand) e.brand = "Enter the brand.";
  if (!data.model) e.model = "Enter the model.";
  if (!data.carNumber || data.carNumber.replace(/\s/g, "").length < 8) e.carNumber = "Enter a valid car number (e.g. UP32 AB 1234).";
  if (!categories.includes(data.category)) e.category = "Choose a category.";
  if (!Number.isInteger(data.year) || data.year < 2000 || data.year > new Date().getFullYear() + 1) e.year = "Enter a valid year.";
  if (!Number.isInteger(data.seats) || data.seats < 2 || data.seats > 12) e.seats = "Seats must be 2 to 12.";
  if (!transmissions.includes(data.transmission)) e.transmission = "Choose a transmission.";
  if (!fuels.includes(data.fuel)) e.fuel = "Choose a fuel type.";
  if (!(data.pricePerDay > 0)) e.pricePerDay = "Enter a price greater than 0.";
  if (!(data.securityDeposit >= 0) || s("securityDeposit") === "") e.securityDeposit = "Enter the deposit (0 or more).";
  if (data.description.length < 20) e.description = "Write at least 20 characters.";
  if (!carStatuses.includes(data.status)) data.status = "available";
  return { errors: e, data };
}
