# Scored rounds

The rubric is locked in `score-lock.json`. Scores require a screenshot and code/test evidence.

## Baseline — 59/100

- First view: 15/20. The job is clear, but the main action sits at the fold and the right-hand artifact shows generic analytics.
- Product proof: 12/20. The page contains real-looking product UI, but the comment-to-DM transition is a small secondary card.
- Distinctiveness: 6/20. Warm white, dark orange, centered navigation, and quiet panels resemble a standard SaaS template.
- Conversion and trust: 12/15. Trial terms and official API are visible; the price arrives much later.
- Interaction and motion: 1/10. Press feedback exists, but the product transition has no motion or state narrative.
- Responsive: 8/10. The layout is structurally responsive; the first viewport becomes long on smaller screens.
- Accessibility: 5/5. Semantics, focus, contrast, and touch targets are already strong.

Evidence: baseline browser screenshot at 1280 × 720; Impeccable detector returned no rule violations.

## Round 1 — 78/100 — rejected after independent review

- Hypothesis: committed color, oversized outcome-led type, and a dominant comment-to-DM artifact will make the product legible and memorable in the first viewport.
- First view: 19/20. Outcome, official API, trial terms, primary action, and the handoff are visible at desktop and tablet sizes, but the skip link did not move focus.
- Product proof: 15/20. The hero shows comment, keyword match, DM content, link button, tracking, and delivery time; the dashboard numbers were not labelled as sample data.
- Distinctiveness: 17/20. Electric blue, acid yellow, coral, ink, strong type, and keyword motion create a recognizable system without third-party assets.
- Conversion and trust: 11/15. The trial and official API lead; unlabelled sample metrics weakened trust.
- Interaction and motion: 5/10. Product-state motion and physical button response are present, but the login background ignored reduced-motion settings.
- Responsive: 9/10. Browser checks at 390, 768, and 1440 pixels found zero horizontal overflow; the mobile layout becomes deliberately long.
- Accessibility: 2/5. Text contrast and touch targets passed, but the global blue focus ring disappeared against the blue hero and both skip links failed to move focus.

Evidence: browser screenshots for homepage and login; mobile navigation opened and closed correctly; Impeccable detector returned no findings; lint, typecheck, 219 existing tests, and production build passed before the landing regression test was added; the new 2-test landing suite also passed. Independent review rejected the score and identified the four defects above.

## Round 2 — 90/100 — rejected after independent review

- Hypothesis: visible sample-data labels, an acid focus ring, working skip targets, and complete reduced-motion coverage will restore trust and accessibility without weakening the visual direction.
- First view: 20/20. Outcome, official API, trial terms, primary action, and the comment-to-DM artifact are visible; the skip target is programmatically focusable.
- Product proof: 18/20. The workflow and delivery table are specific, and every fictional metric is now labelled as demo or sample data.
- Distinctiveness: 17/20. The original flat-color and keyword system remains intact.
- Conversion and trust: 14/15. Trial, pricing, provider boundary, and sample-data status are explicit.
- Interaction and motion: 9/10. Product motion remains visible by default, and both homepage and login animations stop under reduced-motion settings.
- Responsive: 9/10. Browser checks at 390, 768, and 1440 pixels found zero horizontal overflow.
- Accessibility: 3/5. The acid focus ring exceeds 3:1 on the hero, but disappears on the acid pricing section; the login brand link also retained the blue ring on blue. Skip targets, touch targets, and body-text contrast passed.

## Round 3 — 92/100 — kept

- Hypothesis: surface-specific focus colors will keep the same visible focus treatment across blue, dark, acid, and pale surfaces.
- First view: 20/20.
- Product proof: 18/20.
- Distinctiveness: 17/20.
- Conversion and trust: 14/15.
- Interaction and motion: 9/10.
- Responsive: 9/10.
- Accessibility: 5/5. Acid focus is used on blue and dark surfaces; ink focus is used on the acid pricing section; login's blue panel uses acid focus. Every tested combination exceeds 3:1.
