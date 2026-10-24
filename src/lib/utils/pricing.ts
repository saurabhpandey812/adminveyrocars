import type { Car } from "@/types/car";
export const rentalDays = (from: string, to: string) => Math.max(1, Math.ceil((+new Date(to) - +new Date(from)) / 86_400_000));
export const estimate = (car: Car, from: string, to: string) => {
  const days = rentalDays(from, to), rental = days * car.pricePerDay;
  return { days, rental, deposit: car.securityDeposit, total: rental + car.securityDeposit };
};
export const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
