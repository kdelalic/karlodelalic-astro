// Shuffle recipe cards on page load for per-visitor randomization
const recipesList = document.getElementById('recipes-list');
if (recipesList) {
    const wrappers = Array.from(recipesList.querySelectorAll('.recipe-wrapper'));

    // Fisher-Yates shuffle
    for (let i = wrappers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wrappers[i], wrappers[j]] = [wrappers[j], wrappers[i]];
    }

    // Re-append in shuffled order
    wrappers.forEach(wrapper => recipesList.appendChild(wrapper));

    // Set fetchpriority="high" and loading="eager" for first 2 images (LCP optimization)
    wrappers.slice(0, 2).forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (img) {
            img.setAttribute('fetchpriority', 'high');
            img.setAttribute('loading', 'eager');
        }
    });
}

// Intersection Observer for lazy loading
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all recipe wrappers
document.querySelectorAll('.recipe-wrapper').forEach(wrapper => {
    observer.observe(wrapper);
});

// Client-side interactivity for filtering and search
let activeFilters = new Set<string>();
let searchTerm = '';

function updateRecipeDisplay() {
    const recipeWrappers = document.querySelectorAll('.recipe-wrapper');

    recipeWrappers.forEach((wrapper) => {
        const titleAttr = wrapper.getAttribute('data-recipe-title');
        const tagsAttr = wrapper.getAttribute('data-recipe-tags');

        if (!titleAttr || !tagsAttr) return;

        const title = titleAttr;
        const tags = JSON.parse(tagsAttr);

        // Check search term
        const matchesSearch = !searchTerm || title.includes(searchTerm.toLowerCase());

        // Check filters
        const matchesFilters = activeFilters.size === 0 ||
            Array.from(activeFilters).every(filter => tags.includes(filter));

        if (matchesSearch && matchesFilters) {
            (wrapper as HTMLElement).style.display = '';
        } else {
            (wrapper as HTMLElement).style.display = 'none';
        }
    });

    // Update visible tags based on search results
    updateVisibleTags();
}

function updateVisibleTags() {
    const visibleRecipes = Array.from(document.querySelectorAll('.recipe-wrapper'))
        .filter((wrapper) => (wrapper as HTMLElement).style.display !== 'none');

    const visibleTags = new Set<string>();
    visibleRecipes.forEach((wrapper) => {
        const tagsAttr = wrapper.getAttribute('data-recipe-tags');
        if (tagsAttr) {
            const tags = JSON.parse(tagsAttr);
            tags.forEach((tag: string) => visibleTags.add(tag));
        }
    });

    // Show/hide tag chips based on visibility
    const allChips = document.querySelectorAll('#tag-chips .chip');
    allChips.forEach((chip) => {
        const tag = chip.getAttribute('data-tag');
        if (tag && !visibleTags.has(tag)) {
            (chip as HTMLElement).style.display = 'none';
        } else {
            (chip as HTMLElement).style.display = '';
        }
    });
}

// Listen for search events from the MUI SearchBar component
window.addEventListener('recipeSearch', (e: Event) => {
    const customEvent = e as CustomEvent;
    searchTerm = customEvent.detail.value;
    updateRecipeDisplay();
});

// Chip click handlers
const chips = document.querySelectorAll('.chip[data-tag]');
chips.forEach((chip) => {
    chip.addEventListener('click', () => {
        const tag = chip.getAttribute('data-tag');
        if (!tag) return;

        if (activeFilters.has(tag)) {
            activeFilters.delete(tag);
            chip.classList.remove('active');
        } else {
            activeFilters.add(tag);
            chip.classList.add('active');
        }

        updateRecipeDisplay();
    });

    // Keyboard support
    chip.addEventListener('keydown', (event) => {
        const e = event as KeyboardEvent;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            (event.target as HTMLElement).click();
        }
    });
});

// Recipe tag chip handlers
document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const recipeChip = target.closest('.recipe__body__chips .chip[data-tag]');

    if (recipeChip) {
        const tag = recipeChip.getAttribute('data-tag');
        if (!tag) return;

        // Find corresponding filter chip and toggle it
        const filterChip = document.querySelector(`#tag-chips .chip[data-tag="${tag}"]`);
        if (filterChip) {
            (filterChip as HTMLElement).click();
        }
    }
});
