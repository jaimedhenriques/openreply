import type Stripe from "stripe";
import type { SubscriptionStatus } from "@/app/generated/prisma/client";
import { getPlanForPriceId } from "@/lib/billing/plans";

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "unpaid":
      return "UNPAID";
    case "canceled":
    case "incomplete_expired":
      return "CANCELED";
    default:
      return "NONE";
  }
}

export function getSubscriptionSnapshot(subscription: Stripe.Subscription) {
  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price.id ?? null;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  return {
    workspaceId: subscription.metadata.workspaceId || null,
    customerId,
    subscriptionId: subscription.id,
    priceId,
    plan: getPlanForPriceId(priceId),
    subscriptionStatus: mapStripeSubscriptionStatus(subscription.status),
    currentPeriodEnd: firstItem?.current_period_end
      ? new Date(firstItem.current_period_end * 1000)
      : null,
  };
}
