import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PublicSiteHeader from "@/components/public-site-header";

export const metadata: Metadata = {
  title: "OpenReply - Instagram comment-to-DM automation for creators",
  description:
    "Turn Instagram keyword comments into tracked private replies for GBP 19 per month. One professional account, unlimited campaigns, and no automatic overages.",
};

const trustPoints = [
  "No card for the trial",
  "Official Meta API",
  "No contact overages",
];

const flowSteps = [
  {
    eyebrow: "Connect",
    title: "Link your Instagram professional account",
    description:
      "Sign in by email and connect Instagram once. No password sharing, no browser automation.",
  },
  {
    eyebrow: "Build",
    title: "Pick a post, keywords, and the DM",
    description:
      "Create a campaign for a reel or post: the keyword to watch, the public reply, and the DM to send.",
  },
  {
    eyebrow: "Deliver",
    title: "Replies go out through the official API",
    description:
      "Webhooks catch comments instantly and a polling sweep catches the ones Instagram never pushes, so nothing is missed. Every send is queued, rate-limited, and logged.",
  },
];

const features = [
  "Email magic-link sign-in",
  "One Instagram professional account",
  "Encrypted tokens at rest",
  "Webhook + polling reconciliation",
  "Queue-backed delivery worker",
  "Per-account rate limiting",
  "Tracked links with click stats",
  "DM logs with full status",
  "5,000 monthly DMs on Pro",
];

/* Static, faithful copies of the real Overview and Dashboard screens, built in
   the app's own design tokens so what visitors see is what the app looks like. */

function AppWindow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 text-xs text-muted">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

const overviewStats = [
  ["Views", "847.2K"],
  ["Reach", "612.4K"],
  ["Likes", "38.1K"],
  ["Comments", "4,204"],
  ["Saved", "9,712"],
  ["Shares", "2,340"],
];

const overviewPosts = [
  ["Spring drop reel", "214.8K", "9.1K", "Apr 3"],
  ["Restock haul", "88.4K", "5.2K", "Mar 28"],
  ["Behind the studio", "51.3K", "3.4K", "Mar 21"],
];

function OverviewPreview() {
  return (
    <AppWindow label="app / overview">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Overview</h3>
          <p className="mt-1 text-xs text-muted">
            Recent — 24 posts from @studio.store
          </p>
        </div>
        <span className="rounded border border-border px-2 py-1 text-xs text-muted">
          Last 50
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {overviewStats.map(([label, value]) => (
          <Stat key={label} label={label} value={value} />
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-foreground">
            Followers over time
          </p>
          <p className="text-xs text-muted">
            48,210 <span className="text-success">+1,240</span> · 30d
          </p>
        </div>
        <svg
          viewBox="0 0 300 64"
          preserveAspectRatio="none"
          className="mt-3 h-16 w-full"
          aria-hidden="true"
        >
          <polyline
            points="0,54 43,49 86,51 129,40 171,36 214,26 257,20 300,9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="text-accent"
          />
        </svg>
      </div>

      <div className="mt-4 rounded-lg bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Posts</p>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="pb-2 pr-3 font-medium">Post</th>
              <th className="pb-2 px-3 text-right font-medium">Views</th>
              <th className="hidden pb-2 px-3 text-right font-medium sm:table-cell">Likes</th>
              <th className="hidden pb-2 pl-3 text-right font-medium sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {overviewPosts.map(([post, views, likes, date]) => (
              <tr key={post} className="border-b border-border last:border-0">
                <td className="py-2 pr-3 text-foreground">{post}</td>
                <td className="py-2 px-3 text-right text-muted">{views}</td>
                <td className="hidden py-2 px-3 text-right tabular-nums text-muted sm:table-cell">{likes}</td>
                <td className="hidden py-2 pl-3 text-right text-muted sm:table-cell">{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppWindow>
  );
}

function MatchedCommentCard() {
  return (
    <div className="accent-callout w-64 rounded-xl p-4">
      <p className="text-xs font-medium text-accent-soft-foreground">New comment matched</p>
      <p className="mt-1 text-sm font-semibold text-foreground">@maya.co</p>
      <p className="mt-1 text-sm text-muted">LINK please</p>
      <div className="mt-3 border-t border-accent-soft-border pt-3">
        <p className="text-xs text-muted">
          Matched <span className="text-accent">GUIDE</span>
        </p>
        <p className="mt-1 text-sm font-medium text-success">
          Queued private reply
        </p>
      </div>
    </div>
  );
}

const dashboardStats = [
  ["Active Campaigns", "8"],
  ["DMs Sent", "1,284"],
  ["Skipped", "42"],
  ["Failed", "3"],
  ["Clicks", "356"],
  ["CTR", "27.7%"],
];

const dashboardChart: [string, number][] = [
  ["Mon", 42],
  ["Tue", 68],
  ["Wed", 51],
  ["Thu", 94],
  ["Fri", 120],
  ["Sat", 86],
  ["Sun", 73],
];

const dashboardActivity = [
  ["@maya.co", "Product guide reply", "Sent", "text-success"],
  ["@founder.ray", "Price request", "Sent", "text-success"],
  ["@shop.ava", "Lead magnet", "Queued", "text-warning"],
];

function DashboardPreview() {
  const maxDM = Math.max(...dashboardChart.map(([, n]) => n));
  return (
    <AppWindow label="app / dashboard">
      <h3 className="text-base font-semibold text-foreground">Hello, Maya!</h3>
      <p className="mt-1 text-xs text-muted">1 connected account · Demo workspace</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {dashboardStats.map(([label, value]) => (
          <Stat key={label} label={label} value={value} />
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">DMs — Last 7 Days</p>
        <div className="mt-4 flex h-32 items-end gap-2">
          {dashboardChart.map(([day, n]) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-muted">{n}</span>
              <div
                className="w-full rounded-sm bg-accent"
                style={{ height: `${Math.max((n / maxDM) * 100, 4)}%` }}
              />
              <span className="text-[10px] text-muted">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Recent Activity</p>
        <div className="mt-3 space-y-2">
          {dashboardActivity.map(([user, automation, status, color]) => (
            <div
              key={user}
              className="flex items-center justify-between gap-3 border-b border-border py-2 text-sm last:border-0"
            >
              <span className="truncate text-foreground">{user}</span>
              <span className="truncate text-muted">{automation}</span>
              <span className={`text-sm ${color}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </AppWindow>
  );
}

export default async function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PublicSiteHeader active="home" />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-28">
        <div className="max-w-3xl">
          <div className="accent-callout inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-accent-soft-foreground">
            14-day trial · Official Meta API
          </div>

          <h1 className="mt-7 max-w-[12ch] text-balance text-[clamp(3rem,6vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground">
            Make every comment start the right DM
          </h1>

          <p className="mt-6 max-w-[65ch] text-[1.0625rem] leading-8 text-muted">
            When someone comments your keyword on a post or reel, OpenReply
            sends the right private reply, tracks the click, and records the
            result. The hosted service runs on the official Instagram API.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="pressable inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Start the free trial
            </Link>
            <a
              href="#how"
              className="pressable inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground hover:border-border-hover hover:bg-surface"
            >
              See how it works
            </a>
          </div>

          <ul aria-label="Trial details" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {trustPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <OverviewPreview />
          <div className="absolute -bottom-8 -left-6 hidden lg:block">
            <MatchedCommentCard />
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-accent">How it works</p>
            <h2 className="mt-3 max-w-[14ch] text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">
              A comment in, a DM out
            </h2>
            <p className="mt-5 max-w-[60ch] text-base leading-8 text-muted">
              Connect an account, build a campaign, and let it run. Webhooks
              handle live comments and a polling sweep catches missed events.
            </p>
          </div>

          <div className="grid gap-4">
            {flowSteps.map((step, index) => (
              <article
                key={step.title}
                className="grid gap-3 border-t border-border py-6 last:border-b sm:grid-cols-[120px_1fr] sm:gap-6"
              >
                <p className="text-sm font-semibold text-accent">
                  {index + 1}. {step.eyebrow}
                </p>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-24 lg:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:items-center">
          <DashboardPreview />

          <div>
            <p className="text-sm font-semibold text-accent">The dashboard</p>
            <h2 className="mt-3 max-w-[14ch] text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">
              See exactly what happened
            </h2>
            <p className="mt-5 max-w-[60ch] text-base leading-8 text-muted">
              Every comment event is traceable: queued, matched, sent, skipped,
              failed, or rate-limited. No black box.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-accent">What&rsquo;s included</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">
            The focused Instagram campaign toolkit
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">
            Pro includes the working campaign path: triggers, private replies,
            tracked links, follow gates, reports, delivery logs, and team access.
          </p>
        </div>

        <ul className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="border-t border-border py-4 text-sm font-medium text-foreground"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section id="security" className="inverse-section py-24 lg:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-inverse-accent">Security</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
              Built around Meta&rsquo;s official permissions
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["No Instagram passwords", "Connect through Instagram OAuth. OpenReply never asks for an account password."],
              ["Encrypted tokens", "Instagram access tokens are encrypted before they are stored."],
              ["Rate-aware delivery", "The worker queues sends, respects Meta limits, and records failed attempts."],
              ["Clear deletion path", "Disconnect Instagram in settings and use the data-deletion process for workspace removal."],
            ].map(([title, body]) => (
              <article key={title} className="border-t border-inverse-border py-5 last:border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-inverse-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-accent">Pricing</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">
              Predictable monthly spend
            </h2>
            <p className="mt-5 text-base leading-8 text-muted">
              OpenReply stops sends at the plan limit. It does not add contact
              overages to your bill.
            </p>
          </div>

          <div className="accent-callout rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-accent-soft-foreground">OpenReply Pro</p>
                <p className="mt-3 text-5xl font-semibold tracking-[-0.035em] text-foreground">
                  £19<span className="text-base font-semibold text-muted"> / month</span>
                </p>
                <p className="mt-2 text-sm text-muted">£190 yearly · 2 months included</p>
              </div>
              <Link
                href="/login"
                className="pressable inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                Start 14-day trial
              </Link>
            </div>
            <div className="mt-7 grid gap-3 border-t border-accent-soft-border pt-6 sm:grid-cols-2">
              {[
                "100 trial DMs, then 5,000 monthly",
                "Unlimited campaigns",
                "1 Instagram professional account",
                "3 workspace members",
                "Tracked links and shareable reports",
                "No automatic overages",
              ].map((item) => (
                <p key={item} className="text-sm font-medium text-foreground">{item}</p>
              ))}
            </div>
            <p className="mt-6 text-xs leading-5 text-muted">
              Card details are requested only when you choose Pro.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="accent-callout grid gap-8 rounded-2xl p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">
              Turn your next reel&rsquo;s comments into DMs
            </h2>
            <p className="mt-4 text-base text-muted">
              Start with 100 DMs over 14 days. Upgrade only when the campaign proves useful.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/login"
              className="pressable inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Start free
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="font-semibold text-foreground">OpenReply</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/data-deletion" className="hover:text-foreground">Data deletion</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
