import type { CampaignTemplate } from "@/lib/templates/campaign-templates";

interface TemplateVisualProps {
  template: CampaignTemplate;
  compact?: boolean;
}

export default function TemplateVisual({
  template,
  compact = false,
}: TemplateVisualProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex items-start justify-between gap-3 border-b border-border bg-surface p-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted">Comment trigger</p>
          <p className="mt-1.5 truncate text-sm font-bold text-foreground">
            “{template.triggerExample}”
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          {template.category}
        </span>
      </div>

      <div className={`grid ${compact ? "" : "sm:grid-cols-2 sm:divide-x sm:divide-border"}`}>
        <div className="border-b border-border p-4 last:border-b-0 sm:border-b-0">
          <p className="text-xs font-semibold text-muted">Matched keywords</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {template.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-md bg-accent/10 px-2 py-1 text-xs font-bold text-accent"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-muted">Private reply</p>
          <p className="mt-3 text-sm leading-6 text-foreground">
            {template.privateReplyPreview}
          </p>
        </div>
      </div>
    </div>
  );
}
