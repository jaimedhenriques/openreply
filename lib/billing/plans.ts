import type { Plan, SubscriptionStatus } from "@/app/generated/prisma/client";

export const TRIAL_DAYS = 14;

export interface PlanLimits {
  maxAutomations: number;
  maxDMsPerMonth: number;
  maxInstagramAccounts: number;
  maxWorkspaceMembers: number;
}

export type Entitlement = "TRIAL" | "PRO" | "EXPIRED" | "SELF_HOSTED";

export const PLAN_LIMITS: Record<Entitlement, PlanLimits> = {
  TRIAL: {
    maxAutomations: 1,
    maxDMsPerMonth: 100,
    maxInstagramAccounts: 1,
    maxWorkspaceMembers: 1,
  },
  PRO: {
    maxAutomations: Number.POSITIVE_INFINITY,
    maxDMsPerMonth: 5_000,
    maxInstagramAccounts: 1,
    maxWorkspaceMembers: 3,
  },
  EXPIRED: {
    maxAutomations: 1,
    maxDMsPerMonth: 0,
    maxInstagramAccounts: 1,
    maxWorkspaceMembers: 1,
  },
  SELF_HOSTED: {
    maxAutomations: Number.POSITIVE_INFINITY,
    maxDMsPerMonth: 2_000_000_000,
    maxInstagramAccounts: Number.POSITIVE_INFINITY,
    maxWorkspaceMembers: Number.POSITIVE_INFINITY,
  },
};

export interface WorkspaceSubscriptionSnapshot {
  plan: Plan;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: Date;
}

export function hasPaidAccess(status: SubscriptionStatus): boolean {
  return status === "ACTIVE" || status === "TRIALING";
}

export function getWorkspaceEntitlement(
  workspace: WorkspaceSubscriptionSnapshot,
  now = new Date()
): Entitlement {
  if (process.env.OPENREPLY_SELF_HOSTED === "true") {
    return "SELF_HOSTED";
  }
  if (workspace.plan === "PRO" && hasPaidAccess(workspace.subscriptionStatus)) {
    return "PRO";
  }
  return workspace.trialEndsAt.getTime() > now.getTime() ? "TRIAL" : "EXPIRED";
}

export function getPlanForPriceId(priceId: string | null | undefined): Plan {
  if (!priceId) return "FREE";
  if (
    priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_PRO_ANNUAL
  ) {
    return "PRO";
  }
  return "FREE";
}

export function getPriceIdForInterval(interval: "monthly" | "annual"): string {
  const name =
    interval === "annual"
      ? "STRIPE_PRICE_PRO_ANNUAL"
      : "STRIPE_PRICE_PRO_MONTHLY";
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is required`);
  return value;
}

export function getTrialEndDate(now = new Date()): Date {
  return new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}
