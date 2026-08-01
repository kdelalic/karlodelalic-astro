const recipeWrappers = Array.from(
  document.querySelectorAll<HTMLElement>(".recipe-wrapper")
)
const filterChips = Array.from(
  document.querySelectorAll<HTMLButtonElement>("#tag-chips .chip[data-tag]")
)
const recipeCount = document.querySelector<HTMLElement>("#recipe-count")
const noRecipes = document.querySelector<HTMLElement>("#no-recipes")

const activeFilters = new Set<string>()
let searchTerm = ""

const getTags = (recipe: HTMLElement) => {
  try {
    return JSON.parse(recipe.dataset.recipeTags ?? "[]") as string[]
  } catch {
    return []
  }
}

const syncChipState = () => {
  document
    .querySelectorAll<HTMLButtonElement>(".chip[data-tag]")
    .forEach((chip) => {
      const isActive = activeFilters.has(chip.dataset.tag ?? "")
      chip.classList.toggle("active", isActive)
      chip.setAttribute("aria-pressed", String(isActive))
    })
}

const updateRecipeDisplay = () => {
  let visibleCount = 0

  recipeWrappers.forEach((recipe) => {
    const title = recipe.dataset.recipeTitle ?? ""
    const tags = getTags(recipe)
    const matchesSearch = !searchTerm || title.includes(searchTerm)
    const matchesFilters = [...activeFilters].every((tag) => tags.includes(tag))
    const isVisible = matchesSearch && matchesFilters

    recipe.hidden = !isVisible
    if (isVisible) visibleCount += 1
  })

  syncChipState()
  if (recipeCount) {
    recipeCount.textContent = `${visibleCount} ${visibleCount === 1 ? "recipe" : "recipes"}`
  }
  if (noRecipes) noRecipes.hidden = visibleCount !== 0
}

const toggleFilter = (tag: string) => {
  if (activeFilters.has(tag)) activeFilters.delete(tag)
  else activeFilters.add(tag)
  updateRecipeDisplay()
}

filterChips.forEach((chip) => {
  chip.setAttribute("aria-pressed", "false")
  chip.addEventListener("click", () => {
    const tag = chip.dataset.tag
    if (tag) toggleFilter(tag)
  })
})

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement
  const chip = target.closest<HTMLButtonElement>(
    ".recipe__tags .chip[data-tag]"
  )
  const tag = chip?.dataset.tag
  if (tag) toggleFilter(tag)
})

window.addEventListener("recipeSearch", (event) => {
  const searchEvent = event as CustomEvent<{ value: string }>
  searchTerm = searchEvent.detail.value.trim().toLowerCase()
  updateRecipeDisplay()
})
