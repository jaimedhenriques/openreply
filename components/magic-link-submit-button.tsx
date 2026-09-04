"use client";

import { useFormStatus } from "react-dom";

export function MagicLinkSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="pressable inline-flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-accent hover:text-white disabled:cursor-wait disabled:opacity-70"
    >
      <span aria-live="polite">{pending ? "Sending secure link…" : "Email me a magic link"}</span>
    </button>
  );
}
