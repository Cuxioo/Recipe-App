// DOM Elements
const recipeList = document.getElementById("recipeList");
const modal = document.getElementById("modal");
const searchInput = document.getElementById("searchInput");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveRecipeBtn = document.getElementById("saveRecipeBtn");
const recipeView = document.getElementById("recipeView");
const backBtn = document.getElementById("backBtn");
const recipeTitle = document.getElementById("recipeTitle");
const recipeIngredients = document.getElementById("recipeIngredients");
const recipeDescription = document.getElementById("recipeDescription");
const recipeCalories = document.getElementById("recipeCalories");
const recipeProtein = document.getElementById("recipeProtein");
const recipeCarbs = document.getElementById("recipeCarbs");
const recipeFat = document.getElementById("recipeFat");

// Filter Modal
const openFilterBtn = document.getElementById("openFilterBtn");
const filterModal = document.getElementById("filterModal");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const closeFilterBtn = document.getElementById("closeFilterBtn");

// Favorites / All buttons
const favoritesFilterBtn = document.getElementById("favoritesFilterBtn");
const showAllBtn = document.getElementById("showAllBtn");

let editingRecipeId = null;

// --- Local Storage Helpers ---
function getRecipes() {
    return JSON.parse(localStorage.getItem("recipes")) || [];
}
function saveRecipes(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

// --- Render Recipes ---
function renderRecipes(recipes = getRecipes()) {
    recipeList.innerHTML = "";
    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipe-card";

        const title = document.createElement("div");
        title.className = "recipe-title";
        title.textContent = recipe.name;

        const actions = document.createElement("div");
        actions.className = "recipe-actions";

        // Favorite Button
        const favBtn = document.createElement("button");
        favBtn.className = "favorite-btn icon-btn";
        const star = document.createElement("img");
        star.src = recipe.favorite ? "assets/icons/star-filled.png" : "assets/icons/star-empty.png";
        favBtn.appendChild(star);
        favBtn.onclick = e => {
            e.stopPropagation();
            recipe.favorite = !recipe.favorite;
            const allRecipes = getRecipes().map(r => r.id === recipe.id ? recipe : r);
            saveRecipes(allRecipes);
            renderRecipes(recipes);
        };

        // Open
        const openBtn = document.createElement("button");
        openBtn.textContent = "Open";
        openBtn.onclick = e => { e.stopPropagation(); showRecipe(recipe); };

        // Edit
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = e => { e.stopPropagation(); openEditModal(recipe); };

        // Delete
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = e => { e.stopPropagation(); deleteRecipe(recipe.id); };

        actions.append(favBtn, openBtn, editBtn, deleteBtn);
        card.append(title, actions);
        recipeList.appendChild(card);

        let expanded = false;
        title.onclick = () => {
            expanded = !expanded;
            actions.classList.toggle("show", expanded);
            card.classList.toggle("selected", expanded);
        };
    });
}

// --- Recipe Popup View ---
function showRecipe(recipe) {
    recipeView.classList.remove("hidden");
    recipeTitle.textContent = recipe.name;
    recipeIngredients.innerHTML = recipe.ingredients.split(",").map(i => `<li>${i.trim()}</li>`).join("");
    recipeDescription.textContent = recipe.description;
    recipeCalories.textContent = recipe.macros?.calories || 0;
    recipeProtein.textContent = recipe.macros?.protein || 0;
    recipeCarbs.textContent = recipe.macros?.carbs || 0;
    recipeFat.textContent = recipe.macros?.fat || 0;
}
backBtn.onclick = () => recipeView.classList.add("hidden");

// --- Create/Edit Recipe ---
openModalBtn.onclick = () => {
    editingRecipeId = null;
    modal.classList.remove("hidden");
    document.querySelectorAll("#modal input, #modal textarea").forEach(el => el.value = "");
    document.getElementById("modalTitle").textContent = "New Recipe";
};
closeModalBtn.onclick = () => modal.classList.add("hidden");

saveRecipeBtn.onclick = () => {
    const name = document.getElementById("nameInput").value.trim();
    if (!name) return;
    const ingredients = document.getElementById("ingredientsInput").value;
    const description = document.getElementById("descriptionInput").value;
    const calories = Number(document.getElementById("caloriesInput").value) || 0;
    const protein = Number(document.getElementById("proteinInput").value) || 0;
    const carbs = Number(document.getElementById("carbsInput").value) || 0;
    const fat = Number(document.getElementById("fatInput").value) || 0;

    let recipes = getRecipes();
    if (editingRecipeId) {
        const recipe = recipes.find(r => r.id === editingRecipeId);
        recipe.name = name;
        recipe.ingredients = ingredients;
        recipe.description = description;
        recipe.macros = { calories, protein, carbs, fat };
    } else {
        recipes.push({ id: Date.now(), name, ingredients, description, macros: { calories, protein, carbs, fat }, favorite: false });
    }
    saveRecipes(recipes);
    modal.classList.add("hidden");
    renderRecipes();
};

function openEditModal(recipe) {
    editingRecipeId = recipe.id;
    modal.classList.remove("hidden");
    document.getElementById("modalTitle").textContent = "Edit Recipe";
    document.getElementById("nameInput").value = recipe.name;
    document.getElementById("ingredientsInput").value = recipe.ingredients;
    document.getElementById("descriptionInput").value = recipe.description;
    document.getElementById("caloriesInput").value = recipe.macros?.calories || "";
    document.getElementById("proteinInput").value = recipe.macros?.protein || "";
    document.getElementById("carbsInput").value = recipe.macros?.carbs || "";
    document.getElementById("fatInput").value = recipe.macros?.fat || "";
}

// --- Delete Recipe ---
function deleteRecipe(id) {
    const recipes = getRecipes().filter(r => r.id !== id);
    saveRecipes(recipes);
    renderRecipes();
}

// --- Search ---
searchInput.oninput = () => renderRecipes();

// --- Favorites Filter ---
favoritesFilterBtn.onclick = () => {
    const recipes = getRecipes().filter(r => r.favorite);
    renderRecipes(recipes);
};

// --- Show All ---
showAllBtn.onclick = () => renderRecipes();

// --- Filter Modal ---
openFilterBtn.onclick = () => filterModal.classList.remove("hidden");
closeFilterBtn.onclick = () => filterModal.classList.add("hidden");
applyFilterBtn.onclick = () => {
    const maxCals = Number(document.getElementById("filterCalories").value) || Infinity;
    const minProtein = Number(document.getElementById("filterProtein").value) || 0;
    const maxCarbs = Number(document.getElementById("filterCarbs").value) || Infinity;
    const maxFat = Number(document.getElementById("filterFat").value) || Infinity;

    const recipes = getRecipes().filter(r => {
        const m = r.macros || {};
        return m.calories <= maxCals &&
               m.protein >= minProtein &&
               m.carbs <= maxCarbs &&
               m.fat <= maxFat;
    });

    filterModal.classList.add("hidden");
    renderRecipes(recipes);
};

// Initial render
renderRecipes();
