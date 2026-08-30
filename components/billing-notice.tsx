"use client";

import { useSearchParams } from "next/navigation";

export function BillingNotice() {
  const status = useSearchParams().get("billing");
  if (status === "success") {
    return (
      <div className="rounded border border-success/20 bg-success/10 p-4 text-sm text-success">
        Payment received. Stripe is confirming your Pro subscription now.
      </div>
    );
  }
  if (status === "cancelled") {
    return (
      <div className="rounded border border-warning/20 bg-warning/10 p-4 text-sm text-warning">
        Checkout was cancelled. Your current access has not changed.
      </div>
    );
  }
  return null;
}
