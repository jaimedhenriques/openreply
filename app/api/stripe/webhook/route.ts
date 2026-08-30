import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import type { Prisma } from "@/app/generated/prisma/client";
import { getSubscriptionSnapshot } from "@/lib/billing/subscriptions";
import { requireEnv } from "@/lib/env";
import { prisma } from "@/lib/db/client";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

async function upsertSubscription(subscription: Stripe.Subscription) {
  const snapshot = getSubscriptionSnapshot(subscription);
  await prisma.workspace.updateMany({
    where: {
      OR: [
        { id: snapshot.workspaceId ?? "__missing_workspace__" },
        { stripeCustomerId: snapshot.customerId },
        { stripeSubscriptionId: snapshot.subscriptionId },
      ],
    },
    data: {
      plan: snapshot.plan,
      subscriptionStatus: snapshot.subscriptionStatus,
      stripeCustomerId: snapshot.customerId,
      stripeSubscriptionId: snapshot.subscriptionId,
      stripePriceId: snapshot.priceId,
      currentPeriodEnd: snapshot.currentPeriodEnd,
    },
  });
}

async function processBillingEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      if (subscriptionId) {
        await upsertSubscription(
          await getStripe().subscriptions.retrieve(subscriptionId)
        );
      }
      return;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await upsertSubscription(event.data.object as Stripe.Subscription);
      return;
    default:
      return;
  }
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  let duplicate = false;
  try {
    await prisma.billingEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        payload: event as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) throw error;
    duplicate = true;
    const existing = await prisma.billingEvent.findUnique({
      where: { stripeEventId: event.id },
      select: { processedAt: true },
    });
    if (existing?.processedAt) {
      return NextResponse.json({ received: true, duplicate: true });
    }
  }

  try {
    await processBillingEvent(event);
    const metadata =
      "metadata" in event.data.object ? event.data.object.metadata : null;
    await prisma.billingEvent.update({
      where: { stripeEventId: event.id },
      data: {
        workspaceId: metadata?.workspaceId || null,
        processedAt: new Date(),
        errorMessage: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Billing event failed";
    await prisma.billingEvent.update({
      where: { stripeEventId: event.id },
      data: { errorMessage: message.slice(0, 500) },
    });
    return NextResponse.json(
      { success: false, error: "Billing event processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true, duplicate });
}
