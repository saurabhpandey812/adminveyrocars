"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin";
import { revalidateSite } from "@/server/revalidate";
import { setBookingStatus } from "@/server/db";
import type { BookingStatus } from "@/types/booking";

const ok: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];
export async function setBookingStatusAction(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? ""),
    status = String(fd.get("status") ?? "") as BookingStatus;
  if (!ok.includes(status)) return;
  await setBookingStatus(id, status);
  revalidatePath("/", "layout");
  await revalidateSite();
}
