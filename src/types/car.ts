export type CarCategory = "Hatchback" | "Sedan" | "SUV" | "Premium";
export type Transmission = "Manual" | "Automatic";
export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";
export type CarStatus = "available" | "unavailable" | "maintenance";

export interface Car {
  id: string;
  brand: string;
  model: string;
  /** Vehicle registration / number plate (e.g. UP32 AB 1234) */
  carNumber: string;
  slug: string;
  category: CarCategory;
  year: number;
  seats: number;
  transmission: Transmission;
  fuel: FuelType;
  pricePerDay: number; // INR, demo value
  securityDeposit: number; // INR, demo value
  description: string;
  features: string[];
  images: { src: string; alt: string }[];
  featured?: boolean;
  status: CarStatus;
}
