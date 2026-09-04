import type { Metadata } from "next";
import Link from "next/link";
import PublicSiteHeader from "@/components/public-site-header";
import TemplateVisual from "@/components/template-visual";
import { CAMPAIGN_TEMPLATES } from "@/lib/templates/campaign-templates";

export const metadata: Metadata = {
  title: "Instagram Comment to DM Templates - CommentShift",
  description:
    "Copy ready-to-launch Instagram comment-to-DM campaign templates for product links, lead magnets, real estate, fitness, restaurants, events, and creators.",
  keywords: [
    "Instagram comment to DM templates",
    "comment to DM campaigns",
    "Instagram DM automation templates",
    "Manychat alternative templates",
  ],
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicSiteHeader active="templates" />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
              Free campaign library
            </p>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-6xl">
              Instagram campaigns you can copy in minutes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Start with focused comment-to-DM playbooks for lead magnets,
              product links, events, service menus, and client campaigns.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="pressable inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-accent-foreground hover:bg-accent-hover"
              >
                Start free
              </Link>
              <a
                href="#template-grid"
                className="pressable inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-bold text-foreground hover:border-border-hover hover:bg-surface-hover"
              >
                Browse templates
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2" aria-label="Featured campaign templates">
            {CAMPAIGN_TEMPLATES.slice(0, 2).map((template) => (
              <TemplateVisual key={template.slug} template={template} compact />
            ))}
          </div>
        </div>
      </section>

      <section
        id="template-grid"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-accent">Choose your campaign</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            A clear starting point for every call to action
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Each playbook includes keywords, copy, setup steps, and the metrics
            worth watching after launch.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CAMPAIGN_TEMPLATES.map((template) => (
            <article
              key={template.slug}
              className="flex min-h-full flex-col"
            >
              <div className="mb-5">
                <TemplateVisual template={template} compact />
              </div>
              <p className="text-sm font-semibold text-accent">{template.category}</p>
              <h3 className="mt-2 text-xl font-bold leading-tight tracking-[-0.02em] text-foreground">
                {template.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{template.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {template.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-md bg-surface px-2 py-1 text-xs font-semibold text-muted"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="mt-auto grid gap-2 pt-6">
                <Link
                  href={`/templates/${template.slug}`}
                  className="pressable inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-bold text-foreground hover:bg-surface"
                >
                  View playbook
                </Link>
                <Link
                  href={`/login?template=${template.slug}`}
                  className="pressable inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-bold text-accent-foreground hover:bg-accent-hover"
                >
                  Use this template
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
