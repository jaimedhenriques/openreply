import Stripe from "stripe";
import { requireEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
      appInfo: { name: "OpenReply", version: "0.1.0" },
      maxNetworkRetries: 2,
    });
  }
  return stripeClient;
}
