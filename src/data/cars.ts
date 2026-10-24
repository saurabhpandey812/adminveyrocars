import "server-only";
import { readDB } from "@/server/db";

export const getAllCars = async () => (await readDB()).cars;
export const getCars = async () => (await getAllCars()).filter((c) => c.status === "available");
export const getCarBySlug = async (slug: string) => (await getCars()).find((c) => c.slug === slug);
export const getRelatedCars = async (slug: string, n = 3) => {
  const c = await getCarBySlug(slug);
  return (await getCars()).filter((x) => x.slug !== slug && x.category === c?.category).slice(0, n);
};
