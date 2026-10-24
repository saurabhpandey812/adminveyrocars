"use client";
import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { PasswordField } from "@/components/ui/PasswordField";
import { updateProfileAction, type ProfileFormState } from "@/server/actions/profile";
import { adminRoles, type AdminProfile } from "@/types/admin-user";

const initial: ProfileFormState = {};

export function AdminProfileForm({ profile }: { profile: AdminProfile }) {
  const [state, action, pending] = useActionState(updateProfileAction, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const e = state.errors ?? {};

  useEffect(() => {
    if (state.ok) {
      formRef.current?.querySelectorAll<HTMLInputElement>('input[type="password"]').forEach((el) => {
        el.value = "";
      });
    }
  }, [state.ok, state.message]);

  return (
    <form ref={formRef} action={action} className="grid max-w-3xl gap-6">
      {state.message && state.ok && (
        <p role="status" className="border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {state.message}
        </p>
      )}
      {e.form && (
        <p role="alert" className="err">
          {e.form}
        </p>
      )}

      <section className="card grid gap-4 p-5 sm:grid-cols-2">
        <div className="col-span-full flex items-center gap-3 border-b border-line pb-4">
          <span className="grid h-14 w-14 place-items-center bg-ink text-lg font-semibold text-bone">
            {profile.name
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div>
            <h2 className="display text-2xl">Profile</h2>
            <p className="text-sm text-mute">Account details — editable now, ready for more team users later.</p>
          </div>
        </div>

        <Field id="email" name="email" label="Email" type="email" defaultValue={profile.email} error={e.email} autoComplete="username" />
        <div>
          <label htmlFor="role" className="label">
            Role
          </label>
          <select id="role" name="role" defaultValue={profile.role} className="field capitalize" aria-invalid={!!e.role}>
            {adminRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {e.role && (
            <p role="alert" className="err">
              {e.role}
            </p>
          )}
        </div>
        <Field
          id="displayName"
          name="displayName"
          label="Name"
          defaultValue={profile.name}
          error={e.displayName}
          className="sm:col-span-2"
          autoComplete="name"
        />
        <Field
          id="mobile"
          name="mobile"
          label="Mobile"
          type="tel"
          defaultValue={profile.mobile}
          error={e.mobile}
          placeholder="9876543210"
          className="sm:col-span-2"
          autoComplete="tel"
        />
      </section>

      <section className="card grid gap-4 p-5 sm:grid-cols-2">
        <h2 className="display col-span-full text-2xl">Change password</h2>
        <p className="col-span-full -mt-2 text-sm text-mute">Leave blank to keep your current password.</p>
        <PasswordField id="currentPassword" name="currentPassword" label="Current password" error={e.currentPassword} autoComplete="current-password" className="sm:col-span-2" />
        <PasswordField id="newPassword" name="newPassword" label="New password" error={e.newPassword} autoComplete="new-password" />
        <PasswordField id="confirmPassword" name="confirmPassword" label="Confirm new password" error={e.confirmPassword} autoComplete="new-password" />
      </section>

      <div>
        <button type="submit" className="btn btn-dark !min-h-11 px-6" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
