"use client";
import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { PasswordField } from "@/components/ui/PasswordField";
import { loginAction } from "@/server/actions/auth";
import { site } from "@/lib/constants/site";

export default function AdminLogin() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <main className="grid min-h-screen place-items-center bg-ink p-5">
      <form action={action} className="grid w-full max-w-sm gap-4 bg-bone p-8">
        <div><p className="display text-4xl">Sign in</p><p className="mt-1 text-sm text-mute">{site.name}</p></div>
        <Field id="email" label="Email" type="email" autoComplete="username" required />
        <PasswordField id="password" label="Password" autoComplete="current-password" required />
        {state.error && <p role="alert" className="err">{state.error}</p>}
        <button className="btn btn-dark" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
