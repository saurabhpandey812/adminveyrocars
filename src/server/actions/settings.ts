"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin";
import { revalidateSite } from "@/server/revalidate";
import { clearDemoData } from "@/server/db";

export async function clearDemoDataAction() {
  await requireAdmin();
  await clearDemoData();
  revalidatePath("/", "layout");
  await revalidateSite();
}
