import Link from "next/link";
import PublicSiteHeader from "@/components/public-site-header";

export interface SeoPageSection {
  title: string;
  body: string;
}

export interface SeoPageConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta?: string;
  bullets: string[];
  sections: SeoPageSection[];
  comparisonTitle: string;
  comparisons: Array<{
    label: string;
    ours: string;
    other: string;
  }>;
  templateLinks: Array<{
    label: string;
    href: string;
  }>;
  faqs: SeoPageSection[];
}

export default function SeoPageShell({ config }: { config: SeoPageConfig }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicSiteHeader />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
              {config.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-6xl">
              {config.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {config.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="pressable inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-white hover:bg-accent-hover"
              >
                {config.primaryCta}
              </Link>
              <Link
                href="/templates"
                className="pressable inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-bold text-foreground hover:border-border-hover hover:bg-surface-hover"
              >
                {config.secondaryCta ?? "Browse templates"}
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-background p-6 sm:p-7">
            <h2 className="text-base font-bold text-foreground">
              Your campaign checklist
            </h2>
            <ul className="mt-5 grid">
              {config.bullets.map((bullet) => (
                <li key={bullet} className="border-t border-border py-4 text-sm leading-6 text-muted last:border-b">
                  {bullet}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {config.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-accent">Clear differences</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
              {config.comparisonTitle}
            </h2>
          </div>
          <div
            className="mt-8 overflow-x-auto rounded-2xl border border-border bg-background"
            role="region"
            aria-label={`${config.comparisonTitle} comparison`}
            tabIndex={0}
          >
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">
                A comparison of CommentShift and generic automation by campaign need.
              </caption>
              <thead className="bg-surface">
                <tr className="border-b border-border">
                  <th scope="col" className="w-[28%] px-5 py-4 text-sm font-semibold text-muted">
                    Campaign need
                  </th>
                  <th scope="col" className="w-[36%] px-5 py-4 text-sm font-bold text-accent">
                    CommentShift
                  </th>
                  <th scope="col" className="w-[36%] px-5 py-4 text-sm font-semibold text-muted">
                    Generic automation
                  </th>
                </tr>
              </thead>
              <tbody>
                {config.comparisons.map((item) => (
                  <tr key={item.label} className="border-b border-border last:border-0">
                    <th scope="row" className="px-5 py-5 text-sm font-bold text-foreground">
                      {item.label}
                    </th>
                    <td className="border-l border-border bg-accent/[0.04] px-5 py-5 text-sm leading-6 text-foreground">
                      {item.ours}
                    </td>
                    <td className="border-l border-border px-5 py-5 text-sm leading-6 text-muted">
                      {item.other}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8 lg:py-20">
        <div>
          <p className="text-sm font-semibold text-accent">Ready-made campaigns</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
            Launch faster with a focused template
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
            Connect the right Instagram account, pick the post, and turn a proven
            playbook into a measurable comment-to-DM campaign.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.templateLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="pressable group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border bg-background px-5 py-4 text-sm font-semibold text-foreground hover:border-accent/40 hover:bg-accent/[0.04]"
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-accent">FAQ</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl">
              Straight answers before you start
            </h2>
          </div>
          <div className="grid gap-3">
            {config.faqs.map((faq) => (
              <article key={faq.title} className="rounded-xl border border-border bg-background p-5">
                <h3 className="text-base font-bold text-foreground">{faq.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{faq.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="inverse-section rounded-2xl px-6 py-12 text-center sm:px-10">
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] text-inverse-foreground sm:text-4xl">
            Turn the next high-intent comment into a private reply
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-inverse-muted">
            CommentShift uses official Meta private replies and campaign reporting
            your team can act on.
          </p>
          <Link
            href="/login"
            className="pressable mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-accent-foreground hover:bg-accent-hover"
          >
            Start free
          </Link>
        </div>
      </section>
    </main>
  );
}
