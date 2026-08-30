import { prisma } from "@/lib/db/client";
import { getWorkspaceEntitlement, PLAN_LIMITS } from "@/lib/billing/plans";

export async function canConnectInstagramAccount({
  workspaceId,
  instagramId,
}: {
  workspaceId: string;
  instagramId: string;
}) {
  const existingAccount = await prisma.instagramAccount.findUnique({
    where: { instagramId },
    select: { workspaceId: true },
  });

  if (existingAccount && existingAccount.workspaceId !== workspaceId) {
    return {
      allowed: false,
      reason: "already_connected" as const,
    };
  }

  if (existingAccount?.workspaceId === workspaceId) {
    return { allowed: true, reason: null };
  }

  const [workspace, accountCount] = await Promise.all([
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { plan: true, subscriptionStatus: true, trialEndsAt: true },
    }),
    prisma.instagramAccount.count({ where: { workspaceId } }),
  ]);
  if (!workspace) {
    return { allowed: false, reason: "workspace_not_found" as const };
  }

  const entitlement = getWorkspaceEntitlement(workspace);
  if (accountCount >= PLAN_LIMITS[entitlement].maxInstagramAccounts) {
    return { allowed: false, reason: "plan_limit" as const };
  }

  return {
    allowed: true,
    reason: null,
  };
}

export async function getWorkspaceInstagramAccount(
  workspaceId: string,
  instagramAccountId?: string | null
) {
  if (instagramAccountId && instagramAccountId !== "all") {
    return prisma.instagramAccount.findFirst({
      where: { id: instagramAccountId, workspaceId },
    });
  }

  return prisma.instagramAccount.findFirst({
    where: { workspaceId },
    orderBy: { connectedAt: "desc" },
  });
}
