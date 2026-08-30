"use client";

import { Suspense, useEffect, useState } from "react";
import type { AccountOption } from "@/components/account-select";
import { InstagramConnectNotice } from "@/components/instagram-connect-notice";
import { BillingNotice } from "@/components/billing-notice";

interface SettingsData {
  workspace: {
    name: string;
    plan: "FREE" | "PRO";
    subscriptionStatus:
      | "NONE"
      | "TRIALING"
      | "ACTIVE"
      | "PAST_DUE"
      | "UNPAID"
      | "CANCELED";
    trialEndsAt: string;
    currentPeriodEnd: string | null;
    stripeCustomerId: string | null;
    selfHosted: boolean;
    dmsSentThisPeriod: number;
  };
  instagramAccount: {
    id: string;
    username: string;
    instagramId: string;
    tokenExpiresAt: string | null;
    webhookSubscribed: boolean;
  } | null;
  instagramAccounts: Array<
    AccountOption & {
      tokenExpiresAt: string | null;
      webhookSubscribed: boolean;
    }
  >;
}

interface WorkspaceMembersData {
  currentUserRole: "OWNER" | "ADMIN" | "MEMBER";
  members: Array<{
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    createdAt: string;
    user: {
      id: string;
      email: string | null;
      name: string | null;
    };
  }>;
  invitations: Array<{
    id: string;
    email: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    inviteUrl: string;
    expiresAt: string;
  }>;
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [membersData, setMembersData] = useState<WorkspaceMembersData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then((res) => res.json()),
      fetch("/api/workspace/members").then((res) => res.json()),
    ])
      .then(([statsPayload, membersPayload]) => {
        if (!statsPayload.success || !membersPayload.success) {
          throw new Error("settings_unavailable");
        }
        setData(statsPayload.data);
        setMembersData(membersPayload.data);
      })
      .catch(() => setPageError("Settings could not be loaded. Check your connection and try again."))
      .finally(() => setLoading(false));
  }, []);

  async function refreshMembers() {
    const res = await fetch("/api/workspace/members");
    const payload = await res.json();
    if (!res.ok || !payload.success) {
      throw new Error(payload.error ?? "Could not refresh workspace members");
    }
    setMembersData(payload.data);
  }

  async function disconnectInstagram(instagramAccountId: string) {
    if (!confirm("Disconnect Instagram? Campaigns for this account will stop sending DMs.")) {
      return;
    }

    setInstagramError(null);
    setBusy(`disconnect:${instagramAccountId}`);
    try {
      const response = await fetch("/api/instagram/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagramAccountId }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Could not disconnect Instagram");
      }
      window.location.reload();
    } catch (disconnectError) {
      setInstagramError(
        disconnectError instanceof Error
          ? disconnectError.message
          : "Could not disconnect Instagram"
      );
      setBusy(null);
    }
  }

  async function inviteMember(event: React.FormEvent) {
    event.preventDefault();
    setMemberError(null);
    setBusy("invite");
    try {
      const res = await fetch("/api/workspace/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        throw new Error(payload.error ?? "Could not invite member");
      }
      setMembersData(payload.data);
      setInviteEmail("");
    } catch (inviteError) {
      setMemberError(
        inviteError instanceof Error
          ? inviteError.message
          : "Could not invite member"
      );
    } finally {
      setBusy(null);
    }
  }

  async function removeInvitation(invitationId: string) {
    setBusy(`invite:${invitationId}`);
    setMemberError(null);
    try {
      const response = await fetch("/api/workspace/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Could not revoke invitation");
      }
      await refreshMembers();
    } catch (revokeError) {
      setMemberError(
        revokeError instanceof Error
          ? revokeError.message
          : "Could not revoke invitation"
      );
    } finally {
      setBusy(null);
    }
  }

  async function copyInvitation(invitationId: string, inviteUrl: string) {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedInviteId(invitationId);
      window.setTimeout(() => setCopiedInviteId(null), 2000);
    } catch {
      setMemberError("The invite link could not be copied. Select the link and copy it manually.");
    }
  }

  async function startCheckout(interval: "monthly" | "annual") {
    setBillingError(null);
    setBusy(`checkout:${interval}`);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.success || !payload.url) {
        throw new Error(payload.error ?? "Could not start checkout");
      }
      window.location.assign(payload.url);
    } catch (checkoutError) {
      setBillingError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Could not start checkout"
      );
      setBusy(null);
    }
  }

  async function openBillingPortal() {
    setBillingError(null);
    setBusy("portal");
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const payload = await res.json();
      if (!res.ok || !payload.success || !payload.url) {
        throw new Error(payload.error ?? "Could not open billing");
      }
      window.location.assign(payload.url);
    } catch (portalError) {
      setBillingError(
        portalError instanceof Error
          ? portalError.message
          : "Could not open billing"
      );
      setBusy(null);
    }
  }

  if (loading) {
    return <div className="panel h-64 animate-pulse rounded-xl p-8" aria-label="Loading settings" />;
  }

  if (pageError || !data || !membersData) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-error/25 bg-error/10 p-6" role="alert">
        <h2 className="text-base font-semibold text-error">Settings unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-error">{pageError ?? "Settings data is incomplete."}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="pressable mt-5 inline-flex min-h-11 items-center rounded-full bg-error px-5 py-2 text-sm font-semibold text-accent-foreground"
        >
          Reload settings
        </button>
      </div>
    );
  }

  const accounts = data.instagramAccounts;
  const canManageMembers =
    membersData?.currentUserRole === "OWNER" ||
    membersData?.currentUserRole === "ADMIN";
  const canManageBilling = membersData?.currentUserRole === "OWNER";
  const hasActivePro = Boolean(
    data?.workspace.plan === "PRO" &&
      ["ACTIVE", "TRIALING"].includes(data.workspace.subscriptionStatus)
  );
  const isSelfHosted = data?.workspace.selfHosted === true;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Surfaces the ?instagram= code the OAuth routes redirect back with.
          Needs a Suspense boundary: useSearchParams in a prerendered client
          page fails the production build without one. */}
      <Suspense fallback={null}>
        <InstagramConnectNotice />
      </Suspense>
      <Suspense fallback={null}>
        <BillingNotice />
      </Suspense>

      <nav aria-label="Settings sections" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {[
          ["Instagram", "#instagram-settings"],
          ["Team", "#team-settings"],
          ["Billing", "#billing-settings"],
          ["Usage", "#usage-settings"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="pressable inline-flex min-h-11 shrink-0 items-center rounded-full border border-border bg-background px-4 text-sm font-medium text-muted hover:border-border-hover hover:text-foreground"
          >
            {label}
          </a>
        ))}
      </nav>

      <section className="panel rounded-xl p-4 sm:p-6" id="instagram-settings">
        <h2 className="text-base font-semibold mb-6">Instagram Connection</h2>

        {instagramError && (
          <p className="mb-4 text-sm text-error" role="alert">
            {instagramError}
          </p>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Status</p>
              <p className="text-xs text-muted mt-0.5">
                Comment webhooks and private replies depend on this connection.
              </p>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                accounts.length > 0
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {accounts.length > 0 ? "Connected" : "Not connected"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Accounts</p>
              <p className="text-xs text-muted mt-0.5">
                {accounts.length} connected Instagram profile
                {accounts.length === 1 ? "" : "s"}
              </p>
            </div>
            <span className="text-sm text-muted">
              {accounts.length > 0 ? `${accounts.length} connected` : "None"}
            </span>
          </div>

          <div className="space-y-3 py-3">
            {accounts.length === 0 && (
              <p className="text-sm text-muted">
                Connect an Instagram professional account to launch campaigns.
              </p>
            )}
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex flex-col gap-3 rounded border border-border bg-surface/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    @{account.username}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Token expires{" "}
                    {account.tokenExpiresAt
                      ? new Date(account.tokenExpiresAt).toLocaleDateString()
                      : "not available"}{" "}
                    · {account.webhookSubscribed ? "Webhook ready" : "Webhook pending"}
                  </p>
                </div>
                <button
                  onClick={() => disconnectInstagram(account.id)}
                  disabled={busy === `disconnect:${account.id}`}
                  className="pressable inline-flex min-h-11 items-center justify-center rounded-full border border-error/20 px-4 py-2 text-sm font-medium text-error hover:border-error/40 hover:bg-error/10 disabled:opacity-50"
                >
                  {busy === `disconnect:${account.id}`
                    ? "Disconnecting…"
                    : "Disconnect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex gap-3">
          {accounts.length === 0 ? (
            <a
              href="/api/instagram/connect"
              className="pressable inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
            >
              Connect Instagram
            </a>
          ) : (
            <p className="text-xs text-muted">
              The launch plan includes 1 Instagram professional account.
            </p>
          )}
        </div>
      </section>

      <section className="panel rounded-xl p-4 sm:p-6" id="team-settings">
        <h2 className="text-base font-semibold mb-6">Team</h2>
        <div className="space-y-3">
          {membersData?.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {member.user.name ?? member.user.email ?? "Unknown member"}
                </p>
                <p className="text-xs text-muted">{member.user.email}</p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted">
                {member.role}
              </span>
            </div>
          ))}
        </div>

        {membersData?.invitations.length ? (
          <div className="mt-6 border-t border-border pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Pending invites
            </p>
            <div className="space-y-3">
              {membersData.invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex flex-col gap-3 rounded border border-border bg-surface/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {invitation.email}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {invitation.role} · {invitation.inviteUrl}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void copyInvitation(invitation.id, invitation.inviteUrl)}
                      className="pressable min-h-11 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted hover:border-border-hover hover:text-foreground"
                    >
                      {copiedInviteId === invitation.id ? "Copied" : "Copy link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeInvitation(invitation.id)}
                      disabled={busy === `invite:${invitation.id}`}
                      className="pressable min-h-11 rounded-full border border-error/20 px-4 py-2 text-xs font-medium text-error hover:bg-error/10 disabled:opacity-50"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {canManageMembers && (
          <form
            onSubmit={inviteMember}
            className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-[1fr_140px_auto] sm:items-end"
          >
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Email address
              <input
                type="email"
                name="inviteEmail"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="teammate@agency.com…"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                aria-describedby={memberError ? "team-error" : undefined}
                className="min-h-11 rounded-xl border border-border bg-background px-4 py-2 text-sm font-normal text-foreground focus:border-accent"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Role
              <select
                name="inviteRole"
                value={inviteRole}
                onChange={(event) =>
                  setInviteRole(event.target.value as "ADMIN" | "MEMBER")
                }
                className="min-h-11 rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal text-foreground focus:border-accent"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={busy === "invite"}
              className="pressable min-h-11 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-hover disabled:opacity-50"
            >
              {busy === "invite" ? "Inviting…" : "Send invite"}
            </button>
            {memberError && (
              <p id="team-error" role="alert" className="sm:col-span-3 text-sm text-error">{memberError}</p>
            )}
          </form>
        )}
      </section>

      <section className="panel rounded-xl p-4 sm:p-6" id="billing-settings">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Plan
            </p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">
              {isSelfHosted
                ? "Self-hosted"
                : hasActivePro
                ? "OpenReply Pro"
                : new Date(data?.workspace.trialEndsAt ?? 0) > new Date()
                  ? "Free trial"
                  : "Trial ended"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {isSelfHosted
                ? "Unlimited local plan. Meta's platform rate limits still apply."
                : hasActivePro
                ? `5,000 DMs each month${
                    data?.workspace.currentPeriodEnd
                      ? ` · renews ${new Date(
                          data.workspace.currentPeriodEnd
                        ).toLocaleDateString()}`
                      : ""
                  }`
                : `100 DMs during a 14-day trial · ends ${new Date(
                    data?.workspace.trialEndsAt ?? 0
                  ).toLocaleDateString()}`}
            </p>
          </div>

          {isSelfHosted ? null : !canManageBilling ? (
            <p className="text-sm text-muted">The workspace owner manages billing.</p>
          ) : hasActivePro ? (
            <button
              type="button"
              onClick={openBillingPortal}
              disabled={busy === "portal"}
              className="pressable min-h-11 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:border-border-hover disabled:opacity-50"
            >
              {busy === "portal" ? "Opening…" : "Manage billing"}
            </button>
          ) : (
            <div className="flex flex-col gap-2 sm:items-end">
              <button
                type="button"
                onClick={() => startCheckout("monthly")}
                disabled={busy?.startsWith("checkout:")}
                className="pressable min-h-11 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-hover disabled:opacity-50"
              >
                {busy === "checkout:monthly" ? "Opening…" : "Choose £19 monthly"}
              </button>
              <button
                type="button"
                onClick={() => startCheckout("annual")}
                disabled={busy?.startsWith("checkout:")}
                className="pressable min-h-11 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:border-border-hover disabled:opacity-50"
              >
                {busy === "checkout:annual" ? "Opening…" : "Choose £190 yearly"}
              </button>
              {data?.workspace.stripeCustomerId && (
                <button
                  type="button"
                  onClick={openBillingPortal}
                  disabled={busy === "portal"}
                  className="inline-flex min-h-11 items-center px-3 py-1 text-xs font-medium text-muted underline underline-offset-2 disabled:opacity-50"
                >
                  Open previous billing account
                </button>
              )}
            </div>
          )}
        </div>
        {billingError && (
          <p className="mt-4 text-sm text-error" role="alert">{billingError}</p>
        )}
      </section>

      <section className="panel rounded-xl p-4 sm:p-6" id="usage-settings">
        <h2 className="text-base font-semibold mb-6">Usage</h2>
        <div className="flex items-center justify-between gap-3 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              DMs sent this month
            </p>
            <p className="text-xs text-muted mt-0.5">
              {isSelfHosted
                ? "Hosted plan limits are disabled on this deployment."
                : hasActivePro
                ? "5,000 included. Sends stop at the limit; there are no overages."
                : "100 included in the trial. Upgrade to keep campaigns sending."}
            </p>
          </div>
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {data?.workspace.dmsSentThisPeriod ?? 0} /{" "}
            {isSelfHosted
              ? "Unlimited"
              : hasActivePro
              ? "5,000"
              : "100"}
          </span>
        </div>
      </section>
    </div>
  );
}
