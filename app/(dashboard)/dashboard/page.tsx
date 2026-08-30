"use client";

/**
 * Dashboard Home Page
 *
 * Overview cards, 7-day chart, and recent activity feed.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import AccountSelect, { type AccountOption } from "@/components/account-select";
import StatCard from "@/components/stat-card";
import StatusBadge from "@/components/status-badge";

interface DashboardStats {
  userName: string | null;
  contactsCount: number;
  totalAutomations: number;
  activeAutomations: number;
  dmsSentToday: number;
  dmsSentWeek: number;
  dmsSentMonth: number;
  dmsSkippedMonth: number;
  dmsFailedMonth: number;
  totalDMs: number;
  clicksThisMonth: number;
  totalClicks: number;
  ctrThisMonth: number;
  instagramAccounts: AccountOption[];
  selectedInstagramAccountId: string | null;
  topKeywords: { keyword: string; count: number }[];
  dailyDMs: { date: string; count: number }[];
  recentLogs: Array<{
    id: string;
    commenterName: string | null;
    commentText: string;
    status: string;
    createdAt: string;
    automation: { name: string };
    instagramAccount?: { username: string };
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (selectedAccountId !== "all") {
      params.set("instagramAccountId", selectedAccountId);
    }

    async function loadStats() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/dashboard/stats${params.size ? `?${params}` : ""}`,
          { signal: controller.signal }
        );
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error ?? "Failed to load dashboard");
        }

        setStats(result.data);
        setError(null);
      } catch (fetchError) {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === "AbortError"
        ) {
          return;
        }
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load dashboard"
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadStats();
    return () => controller.abort();
  }, [retryKey, selectedAccountId]);

  function handleAccountChange(accountId: string) {
    setLoading(true);
    setSelectedAccountId(accountId);
  }

  if (loading && !stats) {
    return (
      <div className="space-y-5" aria-label="Loading dashboard">
        <div className="h-5 w-48 animate-pulse rounded bg-surface-hover" />
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="panel h-32 rounded-xl p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-surface-hover" />
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-surface-hover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="panel rounded-xl p-8 text-center" role="alert">
        <h2 className="text-base font-semibold text-foreground">
          Dashboard unavailable
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {error ?? "We could not load your workspace data."}
        </p>
        <button
          type="button"
          onClick={() => setRetryKey((value) => value + 1)}
          className="pressable mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
        >
          Try again
        </button>
      </div>
    );
  }

  const maxDM = Math.max(...stats.dailyDMs.map((day) => day.count), 1);

  const connectedCount = stats.instagramAccounts.length;
  const needsInstagram = connectedCount === 0;
  const needsCampaign = !needsInstagram && stats.totalAutomations === 0;

  if (needsInstagram || needsCampaign) {
    return (
      <div className="space-y-6" aria-busy={loading}>
        {error && (
          <div
            className="flex flex-col gap-3 rounded-xl border border-error/20 bg-error/5 p-4 sm:flex-row sm:items-center sm:justify-between"
            role="alert"
          >
            <p className="text-sm text-error">{error}</p>
            <button
              type="button"
              onClick={() => setRetryKey((value) => value + 1)}
              className="min-h-11 self-start rounded-lg border border-error/30 px-3 text-sm font-semibold text-error hover:bg-error/5 sm:self-auto"
            >
              Try again
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">
              Welcome{stats.userName ? `, ${stats.userName}` : ""}
            </p>
            <p className="mt-1 text-sm text-muted">
              Complete one step to start turning comments into conversations.
            </p>
          </div>
          {stats.instagramAccounts.length > 1 && (
            <AccountSelect
              accounts={stats.instagramAccounts}
              value={selectedAccountId}
              onChange={handleAccountChange}
            />
          )}
        </div>

        <section
          className="panel overflow-hidden rounded-xl"
          aria-labelledby="activation-title"
        >
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              Start here
            </p>
            <h2
              id="activation-title"
              className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              {needsInstagram
                ? "Connect your Instagram account"
                : "Create your first campaign"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              {needsInstagram
                ? "OpenReply needs one professional Instagram account before it can watch comments and send the right DM."
                : "Choose a post, define the trigger words, and write the message people receive. You can review everything before activating it."}
            </p>
            {needsInstagram ? (
              <a
                href="/api/instagram/connect"
                className="pressable mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Connect Instagram
              </a>
            ) : (
              <Link
                href="/campaigns/new"
                className="pressable mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Create campaign
              </Link>
            )}
          </div>
          <ol className="grid border-t border-border sm:grid-cols-3">
            {["Connect an account", "Create a campaign", "Track replies"].map(
              (step, index) => (
                <li
                  key={step}
                  className="flex min-h-16 items-center gap-3 border-b border-border px-5 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${
                      index === 0 && !needsInstagram
                        ? "bg-success/10 text-success"
                        : "bg-surface-hover text-muted"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {step}
                  </span>
                </li>
              )
            )}
          </ol>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8" aria-busy={loading}>
      {error && (
        <div
          className="flex flex-col gap-3 rounded-xl border border-error/20 bg-error/5 p-4 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-error">{error}</p>
          <button
            type="button"
            onClick={() => setRetryKey((value) => value + 1)}
            className="min-h-11 self-start rounded-lg border border-error/30 px-3 text-sm font-semibold text-error hover:bg-error/5 sm:self-auto"
          >
            Try again
          </button>
        </div>
      )}

      {/* Greeting header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">
            Welcome back{stats.userName ? `, ${stats.userName}` : ""}
          </p>
          <p className="mt-1 text-sm text-muted">
            {connectedCount} connected{" "}
            {connectedCount === 1 ? "account" : "accounts"}
            {" · "}
            {stats.contactsCount}{" "}
            {stats.contactsCount === 1 ? "contact" : "contacts"}
            {" · "}
            <Link href="/logs" className="text-accent hover:underline">
              See activity
            </Link>
          </p>
        </div>
        {stats.instagramAccounts.length > 1 && (
          <AccountSelect
            accounts={stats.instagramAccounts}
            value={selectedAccountId}
            onChange={handleAccountChange}
          />
        )}
      </div>

      {/* Primary outcomes */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Active Campaigns"
          value={stats.activeAutomations}
          description={`${stats.totalAutomations} total`}
        />
        <StatCard
          label="DMs Sent"
          value={stats.dmsSentMonth.toLocaleString()}
          description="This month"
        />
        <StatCard
          label="Click-through Rate"
          value={`${stats.ctrThisMonth}%`}
          description={`${stats.clicksThisMonth.toLocaleString()} clicks this month`}
        />
      </div>

      <dl className="panel grid rounded-xl sm:grid-cols-3">
        {[
          ["Skipped this month", stats.dmsSkippedMonth],
          ["Failed this month", stats.dmsFailedMonth],
          ["DMs sent today", stats.dmsSentToday],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-4 px-4 py-3 sm:block sm:px-5 sm:py-4 ${
              index < 2 ? "border-b border-border sm:border-r sm:border-b-0" : ""
            }`}
          >
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-foreground sm:mt-1 sm:text-lg">
              {Number(value).toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>

      {/* Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6">
        {/* 7-Day Chart */}
        <div className="panel rounded-xl p-4 sm:p-6 lg:col-span-3">
          <h2 className="mb-6 text-sm font-semibold text-foreground">
            DMs — Last 7 Days
          </h2>
          <div className="flex items-end gap-1.5 h-40 sm:gap-2">
            {stats.dailyDMs.map((day) => (
              <div key={day.date} className="min-w-0 flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium tabular-nums text-muted">
                  {day.count}
                </span>
                <div
                  className="w-full rounded-sm bg-accent min-h-[4px]"
                  style={{ height: `${Math.max((day.count / maxDM) * 100, 4)}%` }}
                />
                {/* Seven labels share a phone's width, so they must not wrap. */}
                <span className="w-full truncate text-center text-[10px] text-zinc-500">
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Keywords */}
        <div className="panel rounded-xl p-4 sm:p-6 lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Top Keywords
          </h2>
          <div className="space-y-3">
            {stats.topKeywords.length === 0 && (
              <p className="text-sm text-muted py-8">No keyword matches yet</p>
            )}
            {stats.topKeywords.map((keyword) => (
              <div
                key={keyword.keyword}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate text-sm font-medium text-foreground">
                  {keyword.keyword}
                </span>
                <span className="text-xs tabular-nums text-muted">
                  {keyword.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="panel rounded-xl p-4 sm:p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Recent Activity
          </h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {stats.recentLogs.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">
                No activity yet
              </p>
            )}
            {stats.recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    @{log.commenterName ?? "unknown"}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {log.instagramAccount
                      ? `@${log.instagramAccount.username} · `
                      : ""}
                    {log.commentText}
                  </p>
                </div>
                <StatusBadge status={log.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
