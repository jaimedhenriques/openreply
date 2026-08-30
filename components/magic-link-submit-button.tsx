"use client";

import { useFormStatus } from "react-dom";

export function MagicLinkSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="pressable inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
    >
      <span aria-live="polite">{pending ? "Sending secure link…" : "Email me a magic link"}</span>
    </button>
  );
}
