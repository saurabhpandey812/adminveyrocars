import type { Car } from "@/types/car";

// Matches verocars fleet seed. Prices/deposits are placeholders.
type Seed = Omit<Car, "id" | "slug" | "images" | "description" | "features" | "status" | "featured" | "carNumber"> & {
  features?: string[];
  carNumber?: string;
};
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const base = ["Air conditioning", "Bluetooth audio", "Dual airbags", "ABS", "Rear parking sensors"];

const seeds: Seed[] = [
  { brand: "Mahindra", model: "Scorpio", category: "SUV", year: 2023, seats: 7, transmission: "Manual", fuel: "Diesel", pricePerDay: 4500, securityDeposit: 12000 },
  { brand: "Maruti Suzuki", model: "Swift Dzire", category: "Sedan", year: 2023, seats: 5, transmission: "Manual", fuel: "Petrol", pricePerDay: 2000, securityDeposit: 6000 },
  { brand: "Toyota", model: "Victoris", category: "SUV", year: 2024, seats: 5, transmission: "Automatic", fuel: "Petrol", pricePerDay: 3600, securityDeposit: 10000 },
  { brand: "Maruti Suzuki", model: "Ertiga", category: "Premium", year: 2023, seats: 7, transmission: "Manual", fuel: "CNG", pricePerDay: 3200, securityDeposit: 9000 },
  { brand: "Maruti Suzuki", model: "Swift", category: "Hatchback", year: 2023, seats: 5, transmission: "Manual", fuel: "Petrol", pricePerDay: 1800, securityDeposit: 5000 },
  { brand: "Maruti Suzuki", model: "Baleno", category: "Hatchback", year: 2023, seats: 5, transmission: "Automatic", fuel: "Petrol", pricePerDay: 2200, securityDeposit: 6000 },
  { brand: "Hyundai", model: "i20", category: "Hatchback", year: 2023, seats: 5, transmission: "Manual", fuel: "Petrol", pricePerDay: 2200, securityDeposit: 6000 },
  { brand: "Hyundai", model: "Verna", category: "Sedan", year: 2023, seats: 5, transmission: "Automatic", fuel: "Petrol", pricePerDay: 3200, securityDeposit: 8000 },
  { brand: "Honda", model: "City", category: "Sedan", year: 2022, seats: 5, transmission: "Automatic", fuel: "Petrol", pricePerDay: 3200, securityDeposit: 8000 },
  { brand: "Maruti Suzuki", model: "Brezza", category: "SUV", year: 2023, seats: 5, transmission: "Manual", fuel: "CNG", pricePerDay: 2800, securityDeposit: 8000 },
  { brand: "Hyundai", model: "Creta", category: "SUV", year: 2023, seats: 5, transmission: "Automatic", fuel: "Diesel", pricePerDay: 3800, securityDeposit: 10000 },
  { brand: "Kia", model: "Seltos", category: "SUV", year: 2023, seats: 5, transmission: "Automatic", fuel: "Petrol", pricePerDay: 3800, securityDeposit: 10000 },
  { brand: "Toyota", model: "Innova Crysta", category: "Premium", year: 2022, seats: 7, transmission: "Manual", fuel: "Diesel", pricePerDay: 5500, securityDeposit: 15000 },
  { brand: "Mahindra", model: "XUV700", category: "Premium", year: 2023, seats: 7, transmission: "Automatic", fuel: "Diesel", pricePerDay: 5800, securityDeposit: 15000 },
];

export const seedCars: Car[] = seeds.map((s, i) => {
  const slug = slugify(`${s.brand.split(" ")[0]} ${s.model}`);
  const name = `${s.brand} ${s.model}`;
  const n = String(i + 1).padStart(4, "0");
  return {
    ...s,
    id: `car_${String(i + 1).padStart(3, "0")}`,
    slug,
    carNumber: s.carNumber ?? `UP32 CA ${n}`,
    description: `The ${name} is a ${s.category.toLowerCase()} that suits city drives, business travel and weekend trips from Lucknow.`,
    features: [...base, s.transmission === "Automatic" ? "Automatic transmission" : "Smooth manual gearbox"],
    images: [{ src: `/images/cars/${slug}-1.jpg`, alt: `${name} self-drive rental car` }],
    status: "available",
    featured: ["creta", "brezza", "seltos", "city", "swift", "innova-crysta", "scorpio", "xuv700"].some((x) => slug.endsWith(x)),
  };
});
