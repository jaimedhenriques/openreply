"use client";

/**
 * Instagram Overview Page
 *
 * Aggregate reach/engagement across your recent posts, plus a per-post table.
 * Views / reach / saved / shares come from Instagram media insights (requires
 * the insights permission); likes and comments are always available.
 */

import { useEffect, useState } from "react";
import AccountSelect from "@/components/account-select";
import StatCard from "@/components/stat-card";
import FollowerChart from "@/components/follower-chart";
import type { OverviewResponse } from "@/app/api/instagram/overview/route";

function formatNumber(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const COUNT_OPTIONS = [
  { value: "25", label: "Last 25" },
  { value: "50", label: "Last 50" },
  { value: "100", label: "Last 100" },
  { value: "all", label: "All time" },
];

export default function OverviewPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [count, setCount] = useState("50");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (selectedAccountId !== "all") {
      params.set("instagramAccountId", selectedAccountId);
    }
    params.set("count", count);

    async function loadOverview() {
      setLoading(true);
      try {
        const response = await fetch(`/api/instagram/overview?${params}`, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error ?? "Failed to load overview");
        }

        setData(result.data);
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
            : "Failed to load overview"
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadOverview();
    return () => controller.abort();
  }, [selectedAccountId, count, retryKey]);

  function handleAccountChange(accountId: string) {
    setLoading(true);
    setSelectedAccountId(accountId);
  }

  function handleCountChange(next: string) {
    setLoading(true);
    setCount(next);
  }

  if (loading && !data) {
    return (
      <div
        className="grid gap-3 sm:grid-cols-3 sm:gap-4"
        aria-label="Loading overview"
      >
        {[...Array(3)].map((_, index) => (
          <div key={index} className="panel h-28 rounded-xl p-5">
            <div className="h-4 w-20 animate-pulse rounded bg-surface-hover" />
            <div className="mt-4 h-8 w-24 animate-pulse rounded bg-surface-hover" />
          </div>
        ))}
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="panel rounded-xl p-8 text-center" role="alert">
        <h2 className="text-base font-semibold text-foreground">
          Overview unavailable
        </h2>
        <p className="mt-2 text-sm text-error">{error}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRetryKey((value) => value + 1)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground hover:border-border-hover hover:bg-surface-hover"
          >
            Try again
          </button>
          {error.toLowerCase().includes("connect") && (
            <a
              href="/api/instagram/connect"
              className="pressable inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Connect Instagram
            </a>
          )}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { totals, posts, accounts, insightsAvailable, followers, followerHistory } =
    data;
  const secondaryMetrics: Array<[string, number | null]> = [
    ["Likes", totals.likes],
    ["Comments", totals.comments],
    ["Saved", totals.saved],
    ["Shares", totals.shares],
  ];

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted">
            {data.requestedCount === "all" ? "All-time" : "Recent"} —{" "}
            {totals.posts} post{totals.posts === 1 ? "" : "s"} from @
            {data.account.username}
            {data.truncated ? ` (capped at ${totals.posts})` : ""}
          </p>
          {followers !== null && (
            // Kept out of the tile row below: that row sums the selected posts,
            // whereas this is a current account-level total.
            <p className="mt-1 text-sm text-muted">
              {followers.toLocaleString()} followers
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Range
            </span>
            <select
              value={count}
              onChange={(e) => handleCountChange(e.target.value)}
              className="border-0 bg-transparent py-2 pr-1 text-sm text-foreground outline-none"
            >
              {COUNT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          {accounts.length > 1 && (
            <AccountSelect
              accounts={accounts.map((a) => ({
                id: a.id,
                username: a.username,
                instagramId: a.id,
              }))}
              value={selectedAccountId}
              onChange={handleAccountChange}
            />
          )}
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted" role="status" aria-live="polite">
          Updating overview…
        </p>
      )}

      {!insightsAvailable && (
        <div className="panel rounded-xl border border-border p-4">
          <p className="text-sm text-foreground">
            Views, reach, saved and shares need the insights permission.
          </p>
          <p className="mt-1 text-sm text-muted">
            Reconnect your account to grant it — likes and comments are shown in
            the meantime.
          </p>
          <a
            href="/api/instagram/connect"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-accent hover:underline"
          >
            Reconnect Instagram
          </a>
        </div>
      )}

      {/* Primary outcomes */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Views"
          value={formatNumber(totals.views)}
          description="Across selected posts"
        />
        <StatCard
          label="Reach"
          value={formatNumber(totals.reach)}
          description="Across selected posts"
        />
        <StatCard
          label="Interactions"
          value={formatNumber(totals.interactions)}
          description="Likes, comments, saves and shares"
        />
      </div>

      <dl className="panel grid rounded-xl sm:grid-cols-4">
        {secondaryMetrics.map(([label, value], index) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-4 px-4 py-3 sm:block sm:px-5 sm:py-4 ${
              index < 3 ? "border-b border-border sm:border-r sm:border-b-0" : ""
            }`}
          >
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-foreground sm:mt-1 sm:text-lg">
              {formatNumber(value)}
            </dd>
          </div>
        ))}
      </dl>

      {/* Follower trend — account-level, independent of the post range */}
      <FollowerChart data={followerHistory} followers={followers} />

      {/* Per-post table */}
      <div className="panel rounded-xl p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">No posts found</p>
        ) : (
          // Eight metric columns can't compress into a phone; let the table keep
          // its natural width and scroll inside the panel instead.
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-500 border-b border-border">
                  <th className="py-2 pr-4 font-medium">Post</th>
                  <th className="py-2 px-3 font-medium text-right">Views</th>
                  <th className="py-2 px-3 font-medium text-right">Reach</th>
                  <th className="py-2 px-3 font-medium text-right">Likes</th>
                  <th className="py-2 px-3 font-medium text-right">Comments</th>
                  <th className="py-2 px-3 font-medium text-right">Saved</th>
                  <th className="py-2 px-3 font-medium text-right">Shares</th>
                  <th className="py-2 pl-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 pr-4 max-w-xs">
                      {p.permalink ? (
                        <a
                          href={p.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-accent truncate block"
                        >
                          {p.caption || `${p.mediaType} post`}
                        </a>
                      ) : (
                        <span className="text-foreground truncate block">
                          {p.caption || `${p.mediaType} post`}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-muted">
                      {formatNumber(p.views)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-muted">
                      {formatNumber(p.reach)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-muted">
                      {formatNumber(p.likes)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-muted">
                      {formatNumber(p.comments)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-muted">
                      {formatNumber(p.saved)}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-muted">
                      {formatNumber(p.shares)}
                    </td>
                    <td className="py-3 pl-3 text-right tabular-nums text-zinc-500">
                      {formatDate(p.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
