# Personal Website Revamp — Requirements

Status: Approved for implementation / living document
Last updated: 2026-08-01

This document records the current direction for `karlodelalic.me`. It should be
updated as decisions are made. Confirmed requirements, tentative directions,
and open questions are kept separate so mockup ideas do not accidentally become
requirements.

## Objective

Turn the site from an early-career portfolio into a small personal homepage:

- provide a simple index of Karlo's projects and profiles;
- keep the recipe collection because it is a regularly used personal utility;
- remove content that no longer represents Karlo;
- feel personal, cozy, and deliberately simple.

The site is not intended to prove technical ability through project volume,
technology badges, or long career copy.

## Confirmed principles

- The site should be minimal, simple, and cozy.
- It should not look like a modern SaaS landing page or design portfolio.
- Maturity should come from restraint and clarity, not a job-level label.
- Do not describe Karlo as "senior" anywhere on the site or in metadata.
- Personal projects should be presented as useful links, not portfolio case
  studies.
- Contact information should not be published directly. LinkedIn is the public
  professional contact path.
- Recipes remain a first-class part of the site.

## Information architecture

### Homepage (`/`)

The homepage should be a compact personal index containing:

- Karlo Delalic;
- a short introduction or occupation line;
- a link to LinkedIn;
- a link to GitHub;
- a link to `https://campsite.karlodelalic.me`;
- a link to `https://recipe.karlodelalic.me`;
- a link to `https://tdee.karlodelalic.me`;
- a link to the recipe collection on this site.
- an attributed useful link to n1snt's `Fast + Minimal` Zsh setup gist.

Use these public app names:

- `Campground Checker` for `https://campsite.karlodelalic.me`;
- `Recipe Generator` for `https://recipe.karlodelalic.me`;
- `TDEE Calculator` for `https://tdee.karlodelalic.me`;
- `Recipes` for the recipe collection on this site.

Each personal app link should contain only:

- one emoji associated with the app; and
- the app's human-readable name.

Do not add a description, raw domain, screenshot, technology list, or other
secondary content to an app link. The visible name remains the accessible link
label; the emoji is decorative.

### Recipes (`/recipes`)

Preserve the existing recipe collection and its core utility:

- all current recipe entries;
- recipe images;
- search;
- filtering;
- personal notes;
- links to original recipe sources.

Recipes should use a stable alphabetical default order. Do not add favorites or
favorite-based ordering.

The recipe experience may be visually refreshed, but it should remain fast and
practical for repeated personal use.

#### Tentative recipe presentation

The recipe index should feel like the useful, image-rich part of the same
personal site rather than a separate portfolio project:

- use the same active palette and global palette picker as the homepage;
- use a compact header with a clear path back to the homepage;
- place search and filters before the recipe results;
- retain a responsive image grid: one column on small screens and two or three
  columns as space allows;
- keep each result simple: image, recipe title, a small number of useful tags,
  and an indication when personal notes exist;
- clearly distinguish links that open an original external recipe source;
- use spacing and thin borders instead of heavy cards and shadows;
- preserve quick scanning and repeated use over decorative presentation.

This is a planning direction, not a final recipe-page design.

### Routes to retire from primary navigation

- `/blog`
- `/contact`
- `/projects`

`/projects`, `/contact`, and `/blog` should redirect to the homepage. Individual
blog posts must no longer be publicly accessible.

Keep the retired page implementations, blog article, project content, profile
photo, original gradient-logo asset, and technology assets in the repository.
Reuse the logo's rounded-square `K` geometry and two-color gradient treatment in
the public header, recolored to match the active palette. Do not render the
other retired assets.

## Content requirements

### Include

- Name: `Karlo Delalic`
- Occupation should be stated as `Builder`.
- LinkedIn and GitHub profile links.
- Campsite and Recipe project links.
- A direct path to the recipe collection.

### Exclude

- The word `senior` as a title or positioning statement.
- Public email address.
- Public résumé link.
- The existing generic line `I like to make cool things.`
- The 2019 blog post as featured homepage content.
- Old projects used only to fill a portfolio grid.
- Technology-logo walls, skill inventories, and stack badges.

### Homepage copy and emoji

- Introduction: `Builder. A small collection of things I make and
use.`
- Campground Checker: `🏕️`
- Recipe Generator: `🪄`
- TDEE Calculator: `⚖️`
- Recipes: `🍲`

## Visual direction

### Confirmed

- Cozy rather than sleek or highly polished.
- Minimal rather than sparse-but-oversized.
- Normal-sized copy instead of an editorial hero statement.
- Flat layout with simple spacing and dividers.
- No decorative page gradients, glass effects, floating cards, or excessive
  animation. The small logo gradient is the sole gradient exception.
- Keep the former rounded-square `K` as a small header mark. Its square uses a
  two-color gradient between the active palette's highlight and accent colors,
  and its letter uses the accent-ink color.
- The palette picker should offer multiple genuinely different visual themes.
- The initial palette library should contain:
  - `Camping Emoji`;
  - `Subnautica`;
  - `Ratchet & Clank`.
- The palette library should also include `Original Dark`, preserving the
  former site's charcoal, indigo, green, and white dark-mode palette as one
  complete scheme.
- `Camping Emoji` should use:
  - warm cream or yellow canvas;
  - deep pine green;
  - brighter grass green;
  - coral or red-orange tent accent;
  - warm yellow highlights.
- Other palette options do not need to reuse or derive from the Camping Emoji
  colors.
- Each palette is one complete color scheme. Do not create separate light and
  dark variants and do not add a dark-mode switch.

### Approved layout direction

- A narrow, single-column personal homepage.
- Serif headings with a system sans-serif body.
- Plain underlined links and ordinary lists.
- Emoji-and-name links for personal apps.
- The camping emoji appears on the Campground Checker link, not as a separate
  site logo.

## Interaction and accessibility

- Include a visible color palette picker on the homepage and recipe index.
- The palette picker should show only one emoji per palette; its text label is
  available to assistive technology but is not visually displayed.
- Choose a palette from the full palette library on each page reload.
- Changing the picker should apply the selected palette immediately.
- The browser-tab favicon should use the existing rounded-square `K` and match
  the active palette immediately. Keep the original two-color logo as the
  static favicon and Apple touch-icon fallback.
- A manually selected palette should not remain fixed across reloads.
- Preserve the active palette while navigating between homepage and recipes in
  the same tab. An explicit browser reload must select a different palette from
  the current one.
- The homepage must work from 320px-wide mobile screens through desktop.
- Links must be keyboard accessible and have visible focus states.
- External and internal destinations should be understandable without relying
  only on arrow icons.
- Color must not be the only indicator of link or focus state.
- Motion should be minimal and respect `prefers-reduced-motion`.
- The site should remain usable without client-side JavaScript except where the
  recipe filtering experience requires enhancement.

## Technical direction

- Continue using the existing Astro project unless a concrete reason to change
  emerges.
- Start implementation by updating every direct dependency and development
  dependency to its latest available release, updating the lockfile, adapting
  the code for breaking changes, and verifying the result before beginning the
  redesign.
- Keep the recipe content in source control.
- Avoid adding a design system or frontend framework for the homepage.
- Remove the build-time résumé download once the résumé link is retired.
- Remove obsolete blog/project components and assets only after route handling
  is decided.
- Preserve or improve current metadata, canonical URLs, image optimization, and
  responsive behavior.
- Keep `/admin` and its existing recipe-management workflow working. Do not
  redesign or remove the admin interface or its authentication functions.
- External app and profile links open in the current tab. External recipe
  sources continue to open in a new tab because the recipe index is a repeated
  browsing tool.

### Palette extensibility

- Store palettes in one data-driven registry rather than scattering palette
  conditionals across components and stylesheets.
- Each palette entry should define a stable ID, public name, source or creative
  direction, and all semantic colors required by the shared UI.
- Homepage and recipe components should consume semantic palette values and
  must not contain palette-specific branches.
- Adding a palette should require adding one registry entry, without editing
  the palette picker or page components.
- Add a repository guide for future agents that documents:
  - the palette registry location and schema;
  - required semantic color roles;
  - accessibility and contrast expectations;
  - how reload selection and manual selection work;
  - how to add and verify a new palette;
  - how to test the palette on both the homepage and recipe index.

## Initial acceptance criteria

- A visitor can understand whose site it is without reading a biography.
- Campground Checker, Recipe Generator, TDEE Calculator, Recipes, GitHub, and
  LinkedIn are reachable from the homepage.
- No public email address or résumé link is present.
- The site never labels Karlo as senior.
- Blog and old portfolio projects are not promoted in primary navigation.
- The homepage feels complete without cards, screenshots, or technology badges.
- The palette picker works with a keyboard and applies its selection
  immediately.
- Reloading the page selects from the available palette library again.
- Each personal app link displays only an emoji and its name.
- Existing recipes remain available and searchable.
- Recipes appear alphabetically and do not have a favorites feature.
- The homepage and recipe index work on mobile and desktop.
- Camping Emoji, Subnautica, and Ratchet & Clank are available in the palette
  picker, along with the Original Dark palette.
- A future contributor can add a palette through one documented registry entry
  without changing page components.
- The header logo preserves the former `K` geometry and two-color gradient,
  changing both gradient colors with the active palette.
- The browser-tab favicon matches the active palette, while static and iOS
  fallbacks retain the original green-to-purple logo.
- The existing admin recipe workflow still functions after the redesign.

## Open questions

No blocking product questions remain. Continue updating this section if new
decisions arise during visual review.

## Decision log

### 2026-08-01

- Replace the portfolio concept with a minimal personal link index.
- Keep recipes because they are genuinely used.
- Do not publish direct contact information; use LinkedIn.
- Do not use the title `senior`.
- Include Campsite, Recipe, and TDEE subdomain projects.
- Reject the initial modern/editorial mockup direction.
- Adopt a cozy, minimal, simple visual direction.
- Include an iOS Camping Emoji palette as one option, not as the source of every
  palette.
- Add a palette picker and select from its palette library on every reload.
- Present each personal app link as only an emoji and app name.
- Keep recipe-page design work at the requirements stage for now.
- Use the app names Campground Checker, Recipe Generator, TDEE Calculator, and
  Recipes.
- Begin implementation by updating all dependencies to latest releases.
- Start the palette library with Camping Emoji, Subnautica, and Ratchet &
  Clank; palettes do not require dark variants.
- Keep recipes alphabetical and do not add favorites.
- Make the old blog article inaccessible while retaining it and other retired
  materials in the repository.
- Preserve the existing admin workflow without redesigning it.
- Use 🏕️, 🪄, ⚖️, and 🍲 for Campground Checker, Recipe Generator, TDEE
  Calculator, and Recipes.
- Show palette choices as 🏕️, 🤿, and 🔧 without a visible `Colors` label.
- Add 🌙 as the Original Dark palette, using the previous site's dark-mode
  colors without restoring a separate dark-mode toggle.
- Restore rounded recipe images and controls, constrain recipe thumbnail
  height, and use the former gentle image zoom on hover.
- Add n1snt's fast, minimal Zsh setup gist as an attributed useful resource,
  separate from Karlo's app links.
- Restore the existing rounded-square `K` geometry and two-color gradient as a
  small header mark, recolored from each palette's highlight and accent colors.
- Keep the palette stable during same-tab navigation and rotate it on explicit
  reload.
- Open app and profile links in the current tab; keep original recipe sources
  opening in a new tab.
- Use the camping emoji only for Campground Checker, not as a separate site
  logo.
- Base the Ratchet & Clank palette on the lush Kerwan landscape reference:
  alpine olive, deep teal, sky blues, pale cyan, gold, earth brown, and rust.
- Base the Subnautica palette on the kelp-forest reference: deep kelp green,
  submerged indigo, weathered teal, bioluminescent aqua, and luminous yellow.
  Treat it as one complete dark palette, not as a separate dark-mode variant.
- Make the browser favicon follow the active palette; retain the original
  green-to-purple K for static browser and Apple touch-icon fallbacks.
