const recipesList = document.querySelector<HTMLElement>("#recipes-list")
const recipeWrappers = recipesList
  ? Array.from(recipesList.querySelectorAll<HTMLElement>(".recipe-wrapper"))
  : []
const filterChips = Array.from(
  document.querySelectorAll<HTMLButtonElement>("#tag-chips .chip[data-tag]")
)
const filterGroups = Array.from(
  document.querySelectorAll<HTMLElement>("[data-filter-group]")
)
const filterStatus = document.querySelector<HTMLElement>("#filter-status")
const recipeCount = document.querySelector<HTMLElement>("#recipe-count")
const noRecipes = document.querySelector<HTMLElement>("#no-recipes")

const activeFilters = new Set<string>()
let searchTerm = ""

const shuffleRecipes = () => {
  if (!recipesList) return

  for (let index = recipeWrappers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[recipeWrappers[index], recipeWrappers[randomIndex]] = [
      recipeWrappers[randomIndex],
      recipeWrappers[index],
    ]
  }

  const fragment = document.createDocumentFragment()
  recipeWrappers.forEach((recipe) => fragment.appendChild(recipe))
  recipesList.appendChild(fragment)

  const firstImage = recipeWrappers[0]?.querySelector<HTMLImageElement>("img")
  firstImage?.setAttribute("fetchpriority", "high")
  firstImage?.setAttribute("loading", "eager")
}

const revealRecipesOnScroll = () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  if (reducedMotion || !("IntersectionObserver" in window)) {
    recipeWrappers.forEach((recipe) => recipe.classList.add("visible"))
    return
  }

  document.documentElement.classList.add("recipe-effects-enabled")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add("visible")
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: "50px", threshold: 0.1 }
  )

  recipeWrappers.forEach((recipe) => observer.observe(recipe))
}

const getTags = (recipe: HTMLElement) => {
  try {
    return JSON.parse(recipe.dataset.recipeTags ?? "[]") as string[]
  } catch {
    return []
  }
}

const syncChipState = () => {
  filterChips.forEach((chip) => {
    const isActive = activeFilters.has(chip.dataset.tag ?? "")
    chip.classList.toggle("active", isActive)
    chip.setAttribute("aria-pressed", String(isActive))
  })

  if (filterStatus) {
    filterStatus.textContent = activeFilters.size
      ? `(${activeFilters.size} selected)`
      : ""
  }
}

const updateVisibleTags = () => {
  const visibleTags = new Set<string>()

  recipeWrappers.forEach((recipe) => {
    if (recipe.hidden) return
    getTags(recipe).forEach((tag) => visibleTags.add(tag))
  })

  filterChips.forEach((chip) => {
    const tag = chip.dataset.tag ?? ""
    chip.hidden = !activeFilters.has(tag) && !visibleTags.has(tag)
  })

  filterGroups.forEach((group) => {
    group.hidden = !group.querySelector(".chip:not([hidden])")
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
  updateVisibleTags()
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

window.addEventListener("recipeSearch", (event) => {
  const searchEvent = event as CustomEvent<{ value: string }>
  searchTerm = searchEvent.detail.value.trim().toLowerCase()
  updateRecipeDisplay()
})

shuffleRecipes()
revealRecipesOnScroll()
updateRecipeDisplay()
