export const paletteColorRoles = [
  "canvas",
  "surface",
  "ink",
  "muted",
  "accent",
  "accentText",
  "accentInk",
  "border",
  "highlight",
  "selectionInk",
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
      accentText: "#BA351C",
      accentInk: "#FFF8E7",
      border: "#668925",
      highlight: "#F0C94A",
      selectionInk: "#183E2B",
      focus: "#1D6B44",
    },
  },
  {
    id: "subnautica",
    name: "Subnautica",
    emoji: "🤿",
    direction:
      "Abyssal navy, deep ocean teal, pale tropical aqua, bioluminescent cyan, and survival-suit orange.",
    colors: {
      canvas: "#041F2E",
      surface: "#073B4C",
      ink: "#D9FBF6",
      muted: "#82C9C4",
      accent: "#FF9C3A",
      accentText: "#FF9C3A",
      accentInk: "#061F2C",
      border: "#2E929C",
      highlight: "#0C626D",
      selectionInk: "#D9FBF6",
      focus: "#39DED0",
    },
  },
  {
    id: "ratchet-and-clank",
    name: "Ratchet & Clank",
    emoji: "🔧",
    direction:
      "Kerwan sky blue and cloud cyan, alpine green and deep teal, Ratchet rust, Clank gold, and weathered sci-fi blue.",
    colors: {
      canvas: "#A0CFD9",
      surface: "#CEF2F0",
      ink: "#314015",
      muted: "#315A4B",
      accent: "#79321E",
      accentText: "#79321E",
      accentInk: "#CEF2F0",
      border: "#3A6872",
      highlight: "#DABF54",
      selectionInk: "#314015",
      focus: "#79321E",
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
      accentText: "#8F99FF",
      accentInk: "#0B1028",
      border: "#858585",
      highlight: "#2EBF91",
      selectionInk: "#0B1028",
      focus: "#818CF8",
    },
  },
] as const satisfies readonly Palette[]
