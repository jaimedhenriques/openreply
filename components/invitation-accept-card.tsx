"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InvitationAcceptCardProps {
  token: string;
  isSignedIn: boolean;
  invitedEmail: string;
}

export default function InvitationAcceptCard({
  token,
  isSignedIn,
  invitedEmail,
}: InvitationAcceptCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function acceptInvite() {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/workspace/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const payload = await response.json();
      if (response.ok && payload.success) {
        router.push("/dashboard");
        return;
      }
      setMessage(payload.error ?? "Could not accept invitation");
    } catch {
      setMessage("Could not accept the invitation. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!isSignedIn) {
    return (
      <a
        href="/login"
        className="pressable inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
      >
        Sign in to accept
      </a>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={acceptInvite}
        disabled={busy}
        className="pressable inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover disabled:cursor-wait disabled:opacity-50"
      >
        {busy ? "Accepting..." : "Accept invitation"}
      </button>
      {message && <p role="alert" className="text-sm text-error">{message}</p>}
      <p className="text-xs text-muted">
        Use the magic link account for {invitedEmail}.
      </p>
    </div>
  );
}
