import { requireAdmin } from "@/server/admin";
import { CarForm } from "@/components/admin/CarForm";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Add car" };
export default async function NewCar() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add car" />
      <CarForm />
    </>
  );
}
