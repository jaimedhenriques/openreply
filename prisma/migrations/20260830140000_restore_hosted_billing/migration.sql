-- Restore the hosted SaaS billing state while preserving every existing
-- self-hosted workspace and its accumulated usage.

CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');
CREATE TYPE "SubscriptionStatus" AS ENUM (
  'NONE',
  'TRIALING',
  'ACTIVE',
  'PAST_DUE',
  'UNPAID',
  'CANCELED'
);

ALTER TABLE "Workspace"
  ADD COLUMN "plan" "Plan" NOT NULL DEFAULT 'FREE',
  ADD COLUMN "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'NONE',
  ADD COLUMN "stripeCustomerId" TEXT,
  ADD COLUMN "stripeSubscriptionId" TEXT,
  ADD COLUMN "stripePriceId" TEXT,
  ADD COLUMN "currentPeriodEnd" TIMESTAMP(3),
  ADD COLUMN "trialEndsAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days');

CREATE UNIQUE INDEX "Workspace_stripeCustomerId_key"
  ON "Workspace"("stripeCustomerId");
CREATE UNIQUE INDEX "Workspace_stripeSubscriptionId_key"
  ON "Workspace"("stripeSubscriptionId");

CREATE TABLE "BillingEvent" (
  "id" TEXT NOT NULL,
  "workspaceId" TEXT,
  "stripeEventId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  "errorMessage" TEXT,
  CONSTRAINT "BillingEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BillingEvent_stripeEventId_key"
  ON "BillingEvent"("stripeEventId");
CREATE INDEX "BillingEvent_workspaceId_idx"
  ON "BillingEvent"("workspaceId");
CREATE INDEX "BillingEvent_processedAt_idx"
  ON "BillingEvent"("processedAt");

ALTER TABLE "BillingEvent"
  ADD CONSTRAINT "BillingEvent_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
