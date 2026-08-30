import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const { mockPrisma, mockStripe } = vi.hoisted(() => ({
  mockPrisma: {
    billingEvent: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    workspace: {
      updateMany: vi.fn(),
    },
  },
  mockStripe: {
    webhooks: { constructEvent: vi.fn() },
    subscriptions: { retrieve: vi.fn() },
  },
}));

vi.mock("@/lib/db/client", () => ({ prisma: mockPrisma }));
vi.mock("@/lib/stripe", () => ({ getStripe: () => mockStripe }));
vi.mock("@/lib/env", () => ({ requireEnv: () => "whsec_test" }));

import { POST } from "../app/api/stripe/webhook/route";

function webhookRequest(withSignature = true) {
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: withSignature ? { "stripe-signature": "signature" } : {},
    body: "signed-body",
  }) as NextRequest;
}

function subscriptionEvent() {
  return {
    id: "evt_123",
    type: "customer.subscription.updated",
    data: {
      object: {
        id: "sub_123",
        customer: "cus_123",
        status: "active",
        metadata: { workspaceId: "workspace_123" },
        items: {
          data: [
            {
              price: { id: "price_monthly" },
              current_period_end: 1_799_000_000,
            },
          ],
        },
      },
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STRIPE_PRICE_PRO_MONTHLY", "price_monthly");
  mockPrisma.billingEvent.create.mockResolvedValue({ id: "billing_123" });
  mockPrisma.billingEvent.update.mockResolvedValue({ id: "billing_123" });
  mockPrisma.workspace.updateMany.mockResolvedValue({ count: 1 });
});

describe("Stripe webhook route", () => {
  it("rejects requests without Stripe's signature header", async () => {
    const response = await POST(webhookRequest(false));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Missing Stripe signature",
    });
  });

  it("rejects a signature Stripe cannot verify", async () => {
    mockStripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error("bad signature");
    });

    const response = await POST(webhookRequest());
    expect(response.status).toBe(400);
    expect(mockPrisma.billingEvent.create).not.toHaveBeenCalled();
  });

  it("records and applies a signed subscription event", async () => {
    mockStripe.webhooks.constructEvent.mockReturnValue(subscriptionEvent());

    const response = await POST(webhookRequest());
    expect(response.status).toBe(200);
    expect(mockPrisma.workspace.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          plan: "PRO",
          subscriptionStatus: "ACTIVE",
          stripeCustomerId: "cus_123",
          stripeSubscriptionId: "sub_123",
        }),
      })
    );
    expect(mockPrisma.billingEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { stripeEventId: "evt_123" },
        data: expect.objectContaining({
          workspaceId: "workspace_123",
          processedAt: expect.any(Date),
        }),
      })
    );
  });

  it("does not reapply an event already marked processed", async () => {
    mockStripe.webhooks.constructEvent.mockReturnValue(subscriptionEvent());
    mockPrisma.billingEvent.create.mockRejectedValue({ code: "P2002" });
    mockPrisma.billingEvent.findUnique.mockResolvedValue({
      processedAt: new Date(),
    });

    const response = await POST(webhookRequest());
    await expect(response.json()).resolves.toEqual({
      received: true,
      duplicate: true,
    });
    expect(mockPrisma.workspace.updateMany).not.toHaveBeenCalled();
  });
});
