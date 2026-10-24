import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/admin";
import { getAllCars } from "@/data/cars";
import { CarForm } from "@/components/admin/CarForm";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Edit car" };
export default async function EditCar({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const car = (await getAllCars()).find((c) => c.id === id);
  if (!car) notFound();
  return (<><PageHeader title={`${car.brand} ${car.model}`} /><CarForm car={car} /></>);
}
