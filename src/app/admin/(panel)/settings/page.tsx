import { redirect } from "next/navigation";

/** Settings removed — profile is the account page. */
export default function SettingsRedirect() {
  redirect("/admin/profile");
}
