# Adding a color palette

The public site gets all of its palettes from one registry:
`src/data/palettes.ts`. The homepage, recipe index, picker, reload behavior, and
shared styles do not contain palette-specific branches.

## Registry schema

Add one object to the exported `palettes` array. Every object requires:

- `id`: a unique, stable, kebab-case identifier;
- `name`: the accessible palette name and hover title;
- `emoji`: the single visual value displayed by the picker;
- `direction`: a short description of the visual source and intent;
- `colors`: every semantic color listed below, as an uppercase six-digit hex
  value.

The semantic color roles are:

- `canvas`: page background;
- `surface`: inputs, tags, and image fallback surfaces;
- `ink`: primary text and links;
- `muted`: secondary text;
- `accent`: active controls and link decoration;
- `accentInk`: text placed on the accent color;
- `border`: dividers and control outlines;
- `highlight`: selection and note accents;
- `focus`: keyboard focus outline.

Do not add dark variants. Each registry object is one complete palette.

## Generate and validate

Run:

```sh
bun run generate:palettes
```

This validates IDs, hex formatting, duplicate entries, and the required WCAG
contrast pairs. It then generates `src/generated/palettes.scss`. Do not edit the
generated stylesheet directly. Both `bun run dev` and `bun run build` run the
generator automatically.

Required minimum contrast:

- ink on canvas: 4.5:1;
- muted ink on canvas: 4.5:1;
- accent ink on accent: 4.5:1;
- focus outline on canvas: 3:1.

Passing the generator is the baseline, not a substitute for checking every
control and image boundary visually.

## Selection behavior

The early script in `src/layouts/BaseLayout.astro` selects a palette before the
page is displayed. A first visit chooses from the complete registry. Same-tab
navigation keeps that palette in session storage. An explicit reload chooses a
different palette from the current one.

`src/components/PalettePicker.astro` renders its emoji-only options directly
from the registry while retaining an accessible label. A manual choice applies
immediately and lasts through same-tab navigation, but an explicit reload
rotates away from it.

The header logo and browser favicon also read the new palette's `highlight`,
`accent`, and `accentInk` roles automatically. Adding a registry object
therefore requires no picker, favicon, page-component, or stylesheet changes.

## Verification checklist

After adding a palette:

1. Run `bun run build` and `bun run lint`.
2. Open the homepage and select the new palette.
3. Confirm text, underlines, dividers, the selector, hover states, and keyboard
   focus are clear at desktop and 320px mobile widths.
4. Navigate to `/recipes` and confirm the palette remains active.
5. Check search, tag filters, recipe notes, images, active chips, and the empty
   state.
6. Reload and confirm the site selects a different palette.
7. Confirm the browser-tab favicon changes with the selected palette.
8. Confirm `/admin` still loads; palettes do not apply to the admin interface.
