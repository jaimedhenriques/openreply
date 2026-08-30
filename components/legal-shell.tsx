import PublicSiteHeader from "@/components/public-site-header";

interface LegalShellProps {
  title: string;
  description: string;
  updatedAt: string;
  children: React.ReactNode;
}

export default function LegalShell({
  title,
  description,
  updatedAt,
  children,
}: LegalShellProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicSiteHeader />

      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <div className="border-b border-border pb-10">
          <p className="text-sm font-semibold text-accent">
            Last updated {updatedAt}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-8 text-muted">{description}</p>
        </div>
        <div className="mt-10 space-y-10 text-[0.95rem] leading-7 text-foreground [&_h2]:text-foreground [&_p]:text-muted">
          {children}
        </div>
      </article>
    </main>
  );
}
