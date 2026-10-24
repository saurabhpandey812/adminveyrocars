import type { Car } from "@/types/car";
import type { Booking } from "@/types/booking";
import type { Customer } from "@/types/customer";

// DEMO data so the dashboard has something to show. All records are flagged demo: true.
const names = ["Aarav Mishra", "Priya Srivastava", "Rohit Verma", "Neha Tiwari", "Aman Singh", "Kritika Yadav", "Vikas Gupta", "Sana Khan", "Harsh Pandey", "Isha Agarwal", "Mohit Rastogi", "Anjali Dubey"];

export function seedBookings(cars: Car[], now = new Date()): { customers: Customer[]; bookings: Booking[] } {
  let s = 7;
  const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const day = (off: number) => { const x = new Date(now); x.setDate(x.getDate() + off); return `${x.toISOString().slice(0, 10)}T10:00`; };
  const nowStr = now.toISOString().slice(0, 16);
  const customers: Customer[] = names.map((n, i) => ({
    id: `cus_demo_${i + 1}`, fullName: n, mobile: `+91 98${String(10000000 + i * 7312345).slice(0, 8)}`,
    email: `${n.split(" ")[0].toLowerCase()}.demo@example.com`, createdAt: day(-170 + i * 12), demo: true,
  }));
  const bookings: Booking[] = Array.from({ length: 32 }, (_, k) => {
    const car = cars[Math.floor(rnd() * cars.length)];
    const cust = customers[Math.floor(rnd() * customers.length)];
    const days = 1 + Math.floor(rnd() * 4);
    const start = Math.round(8 - k * 5.4);
    const pickupAt = day(start), returnAt = day(start + days);
    const status: Booking["status"] = returnAt < nowStr ? (rnd() < 0.88 ? "completed" : "cancelled") : pickupAt > nowStr ? (rnd() < 0.5 ? "pending" : "confirmed") : "confirmed";
    const rentalAmount = days * car.pricePerDay;
    return {
      id: `REQ-DEMO${String(k + 1).padStart(2, "0")}`, userId: cust.id, carSlug: car.slug, pickupLocation: "Lucknow city (Gomti Nagar)",
      pickupAt, returnAt, fullName: cust.fullName, mobile: cust.mobile, email: cust.email, drivingLicenceNumber: "DEMO0000000000",
      idProofType: "aadhaar", status, rentalAmount, estimatedTotal: rentalAmount + car.securityDeposit, createdAt: day(start - 3), demo: true,
    };
  });
  return { customers, bookings };
}
