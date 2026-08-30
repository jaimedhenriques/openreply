import type { SeoPageConfig } from "@/components/seo-page-shell";

const templateLinks = [
  { label: "DTC product link template", href: "/templates/dtc-product-link" },
  { label: "Real estate lead form template", href: "/templates/real-estate-lead-form" },
  { label: "Fitness plan template", href: "/templates/fitness-plan" },
  { label: "Browse every template", href: "/templates" },
];

export const templatesSeoPage: SeoPageConfig = {
  eyebrow: "Instagram comment-to-DM templates",
  title: "Instagram comment-to-DM templates for high-intent campaign replies",
  description:
    "Start with proven campaign patterns for product links, lead magnets, price replies, launch waitlists, coaching offers, events, and local services.",
  primaryCta: "Use a template",
  bullets: [
    "Template intent carries into signup and campaign creation.",
    "Each template includes keywords, a campaign goal, and reply copy.",
    "Tracked links turn template replies into measurable clicks.",
    "Agencies can reuse templates across client accounts.",
  ],
  sections: [
    {
      title: "Product link drops",
      body: "Use LINK, SHOP, BUY, or SIZE comments to send exact product pages, launch bundles, or collection links.",
    },
    {
      title: "Lead magnets",
      body: "Use GUIDE, CHECKLIST, PLAN, or START comments to send free resources and follow-up offers.",
    },
    {
      title: "Local services",
      body: "Use PRICE, BOOK, INFO, or TOUR comments to deliver booking links, quote forms, and local offer pages.",
    },
  ],
  comparisonTitle: "Template campaigns vs manual inbox replies",
  comparisons: [
    {
      label: "Speed",
      ours: "Launch from reusable campaign templates in minutes.",
      other: "Reply manually or rebuild the same campaign copy each time.",
    },
    {
      label: "Measurement",
      ours: "Use tracked links and keyword analytics per campaign.",
      other: "Rely on screenshots, inbox memory, or scattered link data.",
    },
    {
      label: "Reuse",
      ours: "Clone the same playbook across posts, reels, and client accounts.",
      other: "Repeat setup work for every campaign.",
    },
  ],
  templateLinks,
  faqs: [
    {
      title: "Can I edit the template copy?",
      body: "Yes. Templates are starting points. You can change keywords, private reply text, tracked destination URLs, and active status before launching.",
    },
    {
      title: "Do templates work for reels?",
      body: "Yes. Campaigns can target Instagram posts or reels returned by the connected professional account.",
    },
  ],
};

export const agenciesSeoPage: SeoPageConfig = {
  eyebrow: "Instagram DM automation for agencies",
  title: "Instagram DM automation for small client campaign teams",
  description:
    "OpenReply gives small teams a client-ready workspace, tracked links, reports, and a focused comment-to-DM workflow for repeatable Instagram campaigns.",
  primaryCta: "Start a client workspace",
  bullets: [
    "Use one Pro workspace for one client Instagram account.",
    "Invite up to 3 owners, admins, or members.",
    "Filter dashboards, logs, campaigns, and settings by account.",
    "Share read-only client reports without exposing workspace controls.",
  ],
  sections: [
    {
      title: "Client separation",
      body: "A separate workspace for each client keeps campaign creation, logs, access, and reporting isolated during the launch release.",
    },
    {
      title: "Repeatable offers",
      body: "Use templates to package lead magnets, product drops, price replies, and launch waitlists as repeatable agency services.",
    },
    {
      title: "Proof of work",
      body: "Shareable reports show sends, skips, failures, clicks, CTR, top keywords, and tracked links in a client-safe view.",
    },
  ],
  comparisonTitle: "Agency workflow vs generic automation",
  comparisons: [
    {
      label: "Client reporting",
      ours: "Public read-only campaign report links, unbranded, with no plan gating.",
      other: "Manual screenshots or dashboards that expose too much internal workspace context.",
    },
    {
      label: "Team roles",
      ours: "Owner, admin, and member roles for up to 3 people.",
      other: "Often one shared login or overpowered teammate access.",
    },
    {
      label: "Account operations",
      ours: "One Instagram professional account per Pro workspace.",
      other: "Client work can get mixed across broad automation workspaces.",
    },
  ],
  templateLinks,
  faqs: [
    {
      title: "How many Instagram accounts can a workspace connect?",
      body: "The launch Pro plan supports one Instagram professional account per workspace. Multi-client agencies should create one workspace per client.",
    },
    {
      title: "Can clients see reports without logging in?",
      body: "Yes. Shareable report pages are public read-only links that hide private workspace controls and DM copy.",
    },
  ],
};

export const commentLinkSeoPage: SeoPageConfig = {
  eyebrow: "Comment LINK automation",
  title: "Comment LINK automation for Instagram posts and reels",
  description:
    "Let followers comment LINK, SHOP, GUIDE, or any keyword and receive the right private reply with a tracked destination URL.",
  primaryCta: "Automate comment LINK",
  bullets: [
    "Match exact keywords or whole-word phrases.",
    "Send Meta-compliant private replies from the triggering comment.",
    "Insert tracked links into replies with click analytics.",
    "Deduplicate comment jobs and log sent, skipped, and failed outcomes.",
  ],
  sections: [
    {
      title: "For product links",
      body: "Turn high-intent LINK comments into tracked visits to product pages, landing pages, waitlists, or checkout offers.",
    },
    {
      title: "For creator offers",
      body: "Send guides, free resources, course links, and coaching applications without manually watching the inbox.",
    },
    {
      title: "For launch spikes",
      body: "Queue and process campaign replies while a reel is getting attention, with plan and rate-limit checks in the worker.",
    },
  ],
  comparisonTitle: "Comment LINK automation vs manual link replies",
  comparisons: [
    {
      label: "Reply accuracy",
      ours: "Every matched comment gets the campaign reply tied to that post or reel.",
      other: "Manual replies are easy to miss when comments spike.",
    },
    {
      label: "Tracking",
      ours: "Tracked links connect private replies to click outcomes.",
      other: "Regular pasted links rarely show campaign-level performance.",
    },
    {
      label: "Compliance",
      ours: "Built around official private reply semantics and rate-aware queues.",
      other: "Unsafe browser automation or scraping can put accounts at risk.",
    },
  ],
  templateLinks,
  faqs: [
    {
      title: "Can I use keywords other than LINK?",
      body: "Yes. Each campaign can use multiple keywords such as PRICE, SHOP, GUIDE, PLAN, WAITLIST, TOUR, or your own phrase.",
    },
    {
      title: "Does OpenReply send a normal Instagram DM?",
      body: "It sends a Meta-compliant private reply triggered by the comment event, using the Instagram comment ID.",
    },
  ],
};
