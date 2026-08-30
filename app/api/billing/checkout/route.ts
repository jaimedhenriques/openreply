import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getPriceIdForInterval } from "@/lib/billing/plans";
import { getBaseUrl } from "@/lib/env";
import { prisma } from "@/lib/db/client";
import { getStripe } from "@/lib/stripe";
import {
  canManageBilling,
  getCurrentWorkspaceContext,
} from "@/lib/workspace-access";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  interval: z.enum(["monthly", "annual"]),
});

export async function POST(request: NextRequest) {
  const [session, context] = await Promise.all([
    auth(),
    getCurrentWorkspaceContext(),
  ]);

  if (!session?.user?.email || !context) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  if (!canManageBilling(context.role)) {
    return NextResponse.json(
      { success: false, error: "Only workspace owners can manage billing" },
      { status: 403 }
    );
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Choose monthly or annual billing" },
      { status: 400 }
    );
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: context.workspaceId },
    select: {
      name: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      subscriptionStatus: true,
    },
  });
  if (!workspace) {
    return NextResponse.json(
      { success: false, error: "Workspace not found" },
      { status: 404 }
    );
  }
  if (
    workspace.stripeSubscriptionId &&
    ["ACTIVE", "TRIALING"].includes(workspace.subscriptionStatus)
  ) {
    return NextResponse.json(
      { success: false, error: "This workspace already has an active Pro subscription" },
      { status: 409 }
    );
  }

  const stripe = getStripe();
  let customerId = workspace.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: workspace.name,
      metadata: { workspaceId: context.workspaceId },
    });
    customerId = customer.id;
    await prisma.workspace.update({
      where: { id: context.workspaceId },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      { price: getPriceIdForInterval(parsed.data.interval), quantity: 1 },
    ],
    allow_promotion_codes: true,
    client_reference_id: context.workspaceId,
    metadata: { workspaceId: context.workspaceId },
    subscription_data: {
      metadata: { workspaceId: context.workspaceId },
    },
    success_url: `${getBaseUrl()}/settings?billing=success`,
    cancel_url: `${getBaseUrl()}/settings?billing=cancelled`,
  });

  if (!checkout.url) {
    return NextResponse.json(
      { success: false, error: "Stripe did not return a checkout URL" },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, url: checkout.url });
}
