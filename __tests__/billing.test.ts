import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import {
  getPlanForPriceId,
  getPriceIdForInterval,
  getTrialEndDate,
  getWorkspaceEntitlement,
  hasPaidAccess,
  PLAN_LIMITS,
} from "../lib/billing/plans";
import {
  getSubscriptionSnapshot,
  mapStripeSubscriptionStatus,
} from "../lib/billing/subscriptions";

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("OPENREPLY_SELF_HOSTED", "false");
  vi.stubEnv("STRIPE_PRICE_PRO_MONTHLY", "price_monthly");
  vi.stubEnv("STRIPE_PRICE_PRO_ANNUAL", "price_annual");
});

describe("hosted billing policy", () => {
  it("maps both paid prices to Pro", () => {
    expect(getPlanForPriceId("price_monthly")).toBe("PRO");
    expect(getPlanForPriceId("price_annual")).toBe("PRO");
    expect(getPlanForPriceId("price_unknown")).toBe("FREE");
    expect(getPriceIdForInterval("monthly")).toBe("price_monthly");
    expect(getPriceIdForInterval("annual")).toBe("price_annual");
  });

  it("gives active paid workspaces Pro limits", () => {
    const entitlement = getWorkspaceEntitlement({
      plan: "PRO",
      subscriptionStatus: "ACTIVE",
      trialEndsAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(entitlement).toBe("PRO");
    expect(PLAN_LIMITS[entitlement]).toMatchObject({
      maxDMsPerMonth: 5_000,
      maxInstagramAccounts: 1,
      maxWorkspaceMembers: 3,
    });
  });

  it("keeps the 100-send trial until its deadline", () => {
    const now = new Date("2026-08-30T12:00:00.000Z");
    const trialEndsAt = getTrialEndDate(now);
    expect(trialEndsAt.toISOString()).toBe("2026-09-13T12:00:00.000Z");
    expect(
      getWorkspaceEntitlement(
        { plan: "FREE", subscriptionStatus: "NONE", trialEndsAt },
        now
      )
    ).toBe("TRIAL");
    expect(PLAN_LIMITS.TRIAL.maxDMsPerMonth).toBe(100);
  });

  it("removes send access after a trial or paid subscription ends", () => {
    const now = new Date("2026-08-30T12:00:00.000Z");
    expect(
      getWorkspaceEntitlement(
        {
          plan: "PRO",
          subscriptionStatus: "CANCELED",
          trialEndsAt: new Date("2026-08-29T12:00:00.000Z"),
        },
        now
      )
    ).toBe("EXPIRED");
    expect(PLAN_LIMITS.EXPIRED.maxDMsPerMonth).toBe(0);
    expect(hasPaidAccess("PAST_DUE")).toBe(false);
  });

  it("maps Stripe subscription states conservatively", () => {
    expect(mapStripeSubscriptionStatus("active")).toBe("ACTIVE");
    expect(mapStripeSubscriptionStatus("trialing")).toBe("TRIALING");
    expect(mapStripeSubscriptionStatus("past_due")).toBe("PAST_DUE");
    expect(mapStripeSubscriptionStatus("canceled")).toBe("CANCELED");
    expect(mapStripeSubscriptionStatus("incomplete")).toBe("NONE");
  });

  it("normalizes the current Stripe subscription item shape", () => {
    const subscription = {
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
    } as unknown as Stripe.Subscription;

    expect(getSubscriptionSnapshot(subscription)).toEqual({
      workspaceId: "workspace_123",
      customerId: "cus_123",
      subscriptionId: "sub_123",
      priceId: "price_monthly",
      plan: "PRO",
      subscriptionStatus: "ACTIVE",
      currentPeriodEnd: new Date(1_799_000_000 * 1000),
    });
  });

  it("preserves unlimited use for explicit self-hosted deployments", () => {
    vi.stubEnv("OPENREPLY_SELF_HOSTED", "true");
    const entitlement = getWorkspaceEntitlement({
      plan: "FREE",
      subscriptionStatus: "NONE",
      trialEndsAt: new Date("2020-01-01T00:00:00.000Z"),
    });
    expect(entitlement).toBe("SELF_HOSTED");
    expect(PLAN_LIMITS[entitlement].maxDMsPerMonth).toBe(2_000_000_000);
    expect(PLAN_LIMITS[entitlement].maxInstagramAccounts).toBe(
      Number.POSITIVE_INFINITY
    );
  });
});
