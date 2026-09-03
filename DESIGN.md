# OpenReply Design System

OpenReply should feel direct, kinetic, and assured in public, then calm and operational inside the product. Creators use it between publishing, checking replies, and running campaigns, often from a phone. The interface must make the next useful action obvious without hiding delivery detail.

## Registers

- Public surfaces: committed color, full-viewport pacing, oversized type, direct product proof, and one clear conversion path.
- Authenticated product: compact system UI, familiar controls, visible state, and fast recovery from errors.
- Voice: candid, precise, and useful. Avoid chatbot language, inflated claims, and abstract automation jargon.

## Foundation

- Type: the platform system stack. Public display text uses weight 600, tight optical tracking no lower than `-0.04em`, and balanced wrapping. Product UI uses a fixed rem scale.
- Product background: cool near-white with a small violet tint.
- Ink: warm near-black.
- Product action: saturated blue. It is reserved for primary actions, current selection, links, and focus.
- Public palette: electric blue, ink, acid yellow, coral, and pale lilac. Large fields of flat color carry the identity; gradients are excluded.
- Surfaces: one neutral layer for panels and one darker hover layer. Use color changes and hairlines for hierarchy.
- Shape: 12–16px for major containers, 8–12px for controls and compact panels, full-pill only for primary actions and short filters.
- Shadow: avoid on interface cards and buttons. Product screenshots may use a restrained shadow when they need separation.

## Interaction

- Targets are at least 44px on touch surfaces.
- Press feedback starts immediately with a short `scale(0.97)` response. Hover and focus increase contrast.
- Transitions name the properties they animate and stay between 100–200ms.
- Motion must remain interruptible and has a reduced-motion alternative.
- Translucency is reserved for sticky navigation. Reduced-transparency mode becomes solid.

## Public Flow

1. State the comment-to-DM outcome and Meta API constraint above the fold.
2. Show the comment, keyword match, and delivered DM as the dominant product artifact.
3. Explain the real Comment → Match → DM sequence.
4. Prove observability and security.
5. Present one hosted plan with the trial, cap, and overage policy in plain language.

Use keyword motion only when it reinforces the trigger model. Motion must leave content visible by default and stop under reduced-motion preferences.

Avoid hero metric grids, repeated uppercase eyebrows, identical feature cards, decorative gradients, generic automation claims, and third-party visual assets.

## Product Flow

- Navigation names concrete destinations and uses one route registry.
- First-run workspaces show Connect Instagram → choose content → publish campaign before analytics.
- Loading, empty, success, warning, and error are distinct states.
- Tables retain semantic markup and scroll within their own region on narrow screens.
- Metrics use tabular numerals. Primary metrics have more visual weight than secondary diagnostics.

## Accessibility

- Maintain WCAG AA text contrast and at least 3:1 focus indicators.
- Every form control has a visible label, useful autocomplete, and inline error or status feedback.
- Disclosures, drawers, and menus remain keyboard operable; closed content is not tabbable.
- Sticky chrome must not cover focused content. Headings and anchor targets use scroll margin.
- Preserve browser zoom, safe areas, reduced motion, reduced transparency, and increased contrast preferences.
