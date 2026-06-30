"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ProfileFormProps {
  initial: { name: string; email: string };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const [name, setName] = useState(initial.name);
  const [password, setPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSavingProfile(false);
      return;
    }
    const { error: metaError } = await supabase.auth.updateUser({
      data: { name },
    });
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: auth.user.id,
        name,
        email: auth.user.email!,
      });
    setSavingProfile(false);
    if (metaError || profileError) {
      setProfileMsg(metaError?.message || profileError?.message || "Failed to save");
      return;
    }
    setProfileMsg("Profile updated.");
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    setSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      setPasswordMsg(error.message);
      return;
    }
    setPassword("");
    setPasswordMsg("Password updated.");
  }

  return (
    <div className="space-y-8">
      <form onSubmit={saveProfile} className="glass rounded-3xl p-6">
        <h2 className="font-display text-xl font-semibold">Personal details</h2>
        <div className="mt-6 grid gap-5">
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input opacity-70"
              value={initial.email}
              disabled
            />
          </div>
        </div>
        {profileMsg && (
          <div className="mt-4 text-sm text-white/70">{profileMsg}</div>
        )}
        <button
          type="submit"
          disabled={savingProfile}
          className="btn-primary mt-6"
        >
          {savingProfile ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </button>
      </form>

      <form onSubmit={savePassword} className="glass rounded-3xl p-6">
        <h2 className="font-display text-xl font-semibold">Change password</h2>
        <div className="mt-6">
          <label className="label" htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            minLength={8}
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        {passwordMsg && (
          <div className="mt-4 text-sm text-white/70">{passwordMsg}</div>
        )}
        <button
          type="submit"
          disabled={savingPassword || password.length < 8}
          className="btn-secondary mt-6"
        >
          {savingPassword ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </div>
  );
}
