import type { Palette } from "../data/palettes"

const letterPath =
  "M590.094,470.479L839.047,154.526H671.078L477.766,397.245l-59.547,84V154.526H266.844v714H418.219V613.557l63.953-45.906L669.125,868.526H841Z"

const createPaletteFavicon = (palette: Palette) => {
  const { accent, accentInk, highlight } = palette.colors
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs><linearGradient id="g" x1="1024" y1="1024" x2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${highlight}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect width="1024" height="1024" rx="150" ry="150" fill="url(#g)"/><path fill="${accentInk}" fill-rule="evenodd" d="${letterPath}"/></svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const applyPaletteFavicon = (palette: Palette) => {
  const favicon = document.querySelector<HTMLLinkElement>(
    "[data-palette-favicon]"
  )
  if (favicon) favicon.href = createPaletteFavicon(palette)
}
