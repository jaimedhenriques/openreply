import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicSiteHeader from "@/components/public-site-header";
import TemplateVisual from "@/components/template-visual";
import {
  CAMPAIGN_TEMPLATES,
  getCampaignTemplate,
  getCampaignTemplateSlugs,
} from "@/lib/templates/campaign-templates";

type TemplatePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCampaignTemplateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getCampaignTemplate(slug);

  if (!template) {
    return {
      title: "Template Not Found - OpenReply",
    };
  }

  return {
    title: `${template.title} - Instagram Comment to DM Template`,
    description: template.summary,
    keywords: [
      `${template.title} template`,
      "Instagram comment to DM template",
      "Instagram DM campaign template",
      template.category,
      template.audience,
    ],
  };
}

export default async function TemplateDetailPage({ params }: TemplatePageProps) {
  const { slug } = await params;
  const template = getCampaignTemplate(slug);

  if (!template) {
    notFound();
  }

  const relatedTemplates = CAMPAIGN_TEMPLATES.filter(
    (item) => item.slug !== template.slug
  ).slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicSiteHeader active="templates" />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <Link
              href="/templates"
              className="pressable inline-flex min-h-11 items-center rounded-lg pr-3 text-sm font-semibold text-muted hover:text-foreground"
            >
              All templates
            </Link>
            <p className="mt-6 text-sm font-semibold text-accent">
              {template.category}
            </p>
            <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-6xl">
              {template.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {template.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/login?template=${template.slug}`}
                className="pressable inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-accent-foreground hover:bg-accent-hover"
              >
                Use this template
              </Link>
              <a
                href="#playbook"
                className="pressable inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-bold text-foreground hover:border-border-hover hover:bg-surface-hover"
              >
                Read playbook
              </a>
            </div>
          </div>

          <TemplateVisual template={template} />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-20">
        <aside className="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1" aria-label="Template details">
          {[
            ["Audience", template.audience],
            ["Setup time", `${template.setupMinutes} minutes`],
            ["Campaign goal", template.goal],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-surface p-5">
              <p className="text-sm font-semibold text-muted">{label}</p>
              <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
            </div>
          ))}
        </aside>

        <div id="playbook" className="scroll-mt-24 space-y-6">
          <section className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground">
              Campaign outcome
            </h2>
            <p className="mt-3 text-base leading-8 text-muted">{template.outcome}</p>
          </section>

          <section className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground">
              Setup playbook
            </h2>
            <ol className="mt-6 space-y-4">
              {template.playbook.map((step, index) => (
                <li key={step} className="grid gap-3 sm:grid-cols-[44px_1fr] sm:items-start">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {index + 1}
                  </span>
                  <span className="pt-1.5 text-sm leading-7 text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-6">
              <h2 className="text-xl font-bold text-foreground">Best for</h2>
              <ul className="mt-4">
                {template.bestFor.map((item) => (
                  <li key={item} className="border-t border-border py-3 text-sm text-muted last:border-b">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6">
              <h2 className="text-xl font-bold text-foreground">Metrics to watch</h2>
              <ul className="mt-4">
                {template.metrics.map((item) => (
                  <li key={item} className="border-t border-border py-3 text-sm text-muted last:border-b">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-accent/20 bg-accent/[0.06] p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground">
                  Copy this campaign into OpenReply
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Sign in, connect Instagram, pick a post or reel, and start with
                  the campaign copy already prepared.
                </p>
              </div>
              <Link
                href={`/login?template=${template.slug}`}
                className="pressable inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-accent-foreground hover:bg-accent-hover"
              >
                Use this template
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground">
            More templates
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedTemplates.map((item) => (
              <Link
                key={item.slug}
                href={`/templates/${item.slug}`}
                className="pressable group rounded-xl border border-border bg-background p-5 hover:border-accent/40"
              >
                <p className="text-sm font-semibold text-accent">{item.category}</p>
                <h3 className="mt-2 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-foreground">View playbook</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
