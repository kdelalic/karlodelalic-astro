const tagGroups = [
  {
    id: "cuisine",
    label: "Cuisine",
    tags: [
      "african",
      "asian",
      "cajun",
      "chinese",
      "french",
      "german",
      "greek",
      "hawaiian",
      "indian",
      "japanese",
      "korean",
      "mexican",
      "middle eastern",
      "persian",
      "peruvian",
      "thai",
      "tex-mex",
    ],
  },
  {
    id: "ingredient",
    label: "Ingredients",
    tags: [
      "beef",
      "chicken",
      "fish",
      "lamb",
      "liver",
      "miso",
      "mussels",
      "pork",
      "potatoes",
      "rice",
      "salmon",
      "sausage",
      "shrimp",
      "steak",
      "tomato",
      "turkey",
    ],
  },
  {
    id: "style",
    label: "Style",
    tags: ["baked", "broth", "easy", "marinade", "salsa", "side", "snack"],
  },
  {
    id: "source",
    label: "Source",
    tags: ["alton brown", "kenji", "maangchi", "serious eats"],
  },
] as const

interface RecipeTagGroup {
  id: string
  label: string
  tags: string[]
}

export const normalizeRecipeTags = (tags: string[]) => [
  ...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
]

export const groupRecipeTags = (tags: string[]) => {
  const availableTags = new Set(tags)
  const categorizedTags = new Set(tagGroups.flatMap((group) => group.tags))
  const groups: RecipeTagGroup[] = tagGroups
    .map((group) => ({
      id: group.id,
      label: group.label,
      tags: group.tags.filter((tag) => availableTags.has(tag)),
    }))
    .filter((group) => group.tags.length > 0)
  const otherTags = tags
    .filter((tag) => !categorizedTags.has(tag))
    .sort((first, second) => first.localeCompare(second))

  if (otherTags.length > 0) {
    groups.push({ id: "other", label: "Other", tags: otherTags })
  }

  return groups
}
