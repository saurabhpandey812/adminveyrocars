import type { Booking } from "@/types/booking";
import type { Car } from "@/types/car";

const BLOCKING: Booking["status"][] = ["pending", "confirmed"];

export function dayPart(iso: string) {
  return iso.slice(0, 10);
}

/** True if booking overlaps the calendar day (inclusive). */
export function bookingCoversDay(b: Booking, day: string) {
  if (!BLOCKING.includes(b.status)) return false;
  return dayPart(b.pickupAt) <= day && dayPart(b.returnAt) >= day;
}

export function carAvailableOnDay(car: Car, bookings: Booking[], day: string) {
  if (car.status !== "available") return false;
  return !bookings.some((b) => b.carSlug === car.slug && bookingCoversDay(b, day));
}

export function availabilityForDay(cars: Car[], bookings: Booking[], day: string) {
  const rows = cars.map((car) => {
    const blockers = bookings.filter((b) => b.carSlug === car.slug && bookingCoversDay(b, day));
    const free = car.status === "available" && blockers.length === 0;
    return { car, free, blockers };
  });
  return {
    available: rows.filter((r) => r.free),
    busy: rows.filter((r) => !r.free),
    rows,
  };
}
