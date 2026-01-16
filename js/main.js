const recipeList = document.getElementById("recipeList");
const modal = document.getElementById("modal");
const searchInput = document.getElementById("searchInput");

const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveRecipeBtn = document.getElementById("saveRecipeBtn");

let editingRecipeId = null;

function getRecipes() {
    return JSON.parse(localStorage.getItem("recipes")) || [];
}

function saveRecipes(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

function renderRecipes(filter = "") {
    recipeList.innerHTML = "";
    const recipes = getRecipes();

    recipes
        .filter(r => r.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(recipe => {
            const card = document.createElement("div");
card.className = "recipe-card";

const title = document.createElement("div");
title.className = "recipe-title";
title.textContent = recipe.name;

const actions = document.createElement("div");
actions.className = "recipe-actions hidden";

const openBtn = document.createElement("button");
openBtn.textContent = "Open";
openBtn.onclick = () => {
    window.location.href = `recipe.html?id=${recipe.id}`;
};

const editBtn = document.createElement("button");
editBtn.textContent = "Edit";
editBtn.onclick = () => openEditModal(recipe);

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
deleteBtn.onclick = () => deleteRecipe(recipe.id);

actions.append(openBtn, editBtn, deleteBtn);
card.append(title, actions);
recipeList.appendChild(card);

let expanded = false;

title.onclick = () => {
    expanded = !expanded;
    actions.classList.toggle("show", expanded);
};

        });
}

function openEditModal(recipe) {
    editingRecipeId = recipe.id;
    modal.classList.remove("hidden");

    document.getElementById("nameInput").value = recipe.name;
    document.getElementById("ingredientsInput").value = recipe.ingredients;
    document.getElementById("descriptionInput").value = recipe.description;
    document.getElementById("caloriesInput").value = recipe.macros?.calories || "";
    document.getElementById("proteinInput").value = recipe.macros?.protein || "";
    document.getElementById("carbsInput").value = recipe.macros?.carbs || "";
    document.getElementById("fatInput").value = recipe.macros?.fat || "";

}

function deleteRecipe(id) {
    if (!confirm("Delete this recipe?")) return;
    const recipes = getRecipes().filter(r => r.id !== id);
    saveRecipes(recipes);
    renderRecipes(searchInput.value);
}

openModalBtn.onclick = () => {
    editingRecipeId = null;
    modal.classList.remove("hidden");
    document.querySelectorAll("#modal input, #modal textarea")
        .forEach(el => el.value = "");
};

closeModalBtn.onclick = () => modal.classList.add("hidden");

saveRecipeBtn.onclick = () => {
    const calories = document.getElementById("caloriesInput").value;
    const protein = document.getElementById("proteinInput").value;
    const carbs = document.getElementById("carbsInput").value;
    const fat = document.getElementById("fatInput").value;

    const macroData = {
    calories: Number(calories) || 0,
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fat: Number(fat) || 0
};

    const name = document.getElementById("nameInput").value.trim();
    const ingredients = document.getElementById("ingredientsInput").value;
    const description = document.getElementById("descriptionInput").value;

    if (!name) return;

    let recipes = getRecipes();

    if (editingRecipeId) {
        const recipe = recipes.find(r => r.id === editingRecipeId);
recipe.name = name;
recipe.ingredients = ingredients;
recipe.description = description;
recipe.macros = {
    calories: Number(calories) || 0,
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fat: Number(fat) || 0
};
    } else {
        recipes.push({
    id: Date.now(),
    name,
    ingredients,
    description,
    macros: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0
    }
});

    }

    saveRecipes(recipes);
    modal.classList.add("hidden");
    renderRecipes(searchInput.value);
};

searchInput.oninput = () => {
    renderRecipes(searchInput.value);
};

renderRecipes();
