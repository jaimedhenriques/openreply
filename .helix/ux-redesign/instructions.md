# OpenReply public buyer-path redesign

## Goal

Turn the public homepage and login handoff into a bold, memorable explanation of one job: a creator receives a comment and OpenReply sends the right Instagram DM.

## Physical scene

A creator checks a new Reel on a phone in bright afternoon light and wants to know, within seconds, whether this service will send the promised link without adding a complicated chatbot workflow.

## Brand voice

Direct, kinetic, assured.

## Reference boundary

- Borrow Buzz's full-viewport pacing, committed color, oversized type, and purposeful motion.
- Borrow ManyChat's immediate comment-to-conversation explanation.
- Do not copy logos, mascots, fonts, illustrations, wording, exact layouts, color values, or protected assets.
- Keep the current OpenReply name until Jaime approves a replacement.

## Declared asset files

- `app/page.tsx`
- `app/login/page.tsx`
- `app/globals.css`
- `components/public-site-header.tsx`
- `components/magic-link-submit-button.tsx`
- `DESIGN.md`
- tests directly covering those files
- `.helix/ux-redesign/*` and `.helix/evidence/ux-redesign-*`

## Stop conditions

- Stop on any copied third-party asset or wording.
- Stop if the existing product test suite regresses.
- Stop after 3 scored iterations.
- Do not rename the product, configure providers, or deploy to production in this task.

## Verification

- Locked score in `score-lock.json`.
- Screenshots at 390, 768, and 1440 pixel widths.
- Keyboard, reduced-motion, overflow, lint, typecheck, tests, and build checks.
- Vercel preview tied to the exact branch commit.
