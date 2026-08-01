export const paletteColorRoles = [
  "canvas",
  "surface",
  "ink",
  "muted",
  "accent",
  "accentInk",
  "border",
  "highlight",
  "focus",
] as const

export type PaletteColorRole = (typeof paletteColorRoles)[number]

export interface Palette {
  id: string
  name: string
  emoji: string
  direction: string
  colors: Record<PaletteColorRole, `#${string}`>
}

export const palettes = [
  {
    id: "camping-emoji",
    name: "Camping Emoji",
    emoji: "🏕️",
    direction:
      "Soft canvas cream, pine-green ink, grassy borders, tent red-orange, and warm canvas-yellow highlights.",
    colors: {
      canvas: "#F5E7C6",
      surface: "#FFF8E7",
      ink: "#183E2B",
      muted: "#50603A",
      accent: "#BA351C",
      accentInk: "#FFF8E7",
      border: "#668925",
      highlight: "#F0C94A",
      focus: "#1D6B44",
    },
  },
  {
    id: "subnautica",
    name: "Subnautica",
    emoji: "🤿",
    direction:
      "Deep kelp green, submerged indigo, weathered teal, bioluminescent aqua, and luminous yellow.",
    colors: {
      canvas: "#0E3B2D",
      surface: "#2C2E59",
      ink: "#B6F3F0",
      muted: "#75BDB2",
      accent: "#FFE500",
      accentInk: "#0E3B2D",
      border: "#3A8D91",
      highlight: "#22624F",
      focus: "#FFE500",
    },
  },
  {
    id: "ratchet-and-clank",
    name: "Ratchet & Clank",
    emoji: "🔧",
    direction:
      "Lush Kerwan-inspired alpine greens, deep teal, clear sky blue, pale cyan, gold, earth brown, and Ratchet rust.",
    colors: {
      canvas: "#C7ECE8",
      surface: "#EDF7F1",
      ink: "#2F451A",
      muted: "#386858",
      accent: "#82351F",
      accentInk: "#F9F4E6",
      border: "#5B9BAC",
      highlight: "#DDBF51",
      focus: "#82351F",
    },
  },
  {
    id: "original-dark",
    name: "Original Dark",
    emoji: "🌙",
    direction:
      "The previous site's dark mode: charcoal surfaces, indigo primary color, fresh green, and cool white text.",
    colors: {
      canvas: "#252525",
      surface: "#333333",
      ink: "#FFFFFF",
      muted: "#D6DBE5",
      accent: "#6772E5",
      accentInk: "#0B1028",
      border: "#424242",
      highlight: "#2EBF91",
      focus: "#818CF8",
    },
  },
] as const satisfies readonly Palette[]
