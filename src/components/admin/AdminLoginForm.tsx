"use client";
import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { PasswordField } from "@/components/ui/PasswordField";
import { loginAction } from "@/server/actions/auth";
import { site } from "@/lib/constants/site";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="grid gap-4">
      <Field id="email" label="Email" type="email" autoComplete="username" required placeholder="you@example.com" />
      <PasswordField id="password" label="Password" autoComplete="current-password" required />
      {state.error && (
        <p role="alert" className="err">
          {state.error}
        </p>
      )}
      <button className="btn btn-dark w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-xs text-mute">Admin access only · {site.name}</p>
    </form>
  );
}
