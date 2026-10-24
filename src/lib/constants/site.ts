import { publicEnv } from "@/config";

// Aligned with verocars (src/lib/constants/site.ts). Edit here for admin labels only;
// customer-facing copy still lives in the website project until DB sync is wired.
export const site = {
  name: "VEYRO CARS",
  tagline: "Drive your way, across Lucknow.",
  url: publicEnv.siteUrl,
  phone: "+91-00000-00000",
  whatsapp: "910000000000",
  email: "hello@example.com",
  address: { street: "[Street address]", city: "Lucknow", state: "Uttar Pradesh", postalCode: "[PIN]", country: "IN" },
  serviceArea: ["Lucknow", "Gomti Nagar", "Hazratganj", "Alambagh"],
  hours: "Daily, 8:00 AM – 9:00 PM",
  social: { instagram: "", facebook: "", youtube: "" },
} as const;
