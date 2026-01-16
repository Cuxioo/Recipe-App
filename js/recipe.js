const params = new URLSearchParams(window.location.search);
const recipeId = Number(params.get("id"));

const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
const recipe = recipes.find(r => r.id === recipeId);
// Ensure macros exist (backward compatibility)
if (!recipe.macros) {
    recipe.macros = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    };
}

const macroBox = recipe.macros || { calories: 0, protein: 0, carbs: 0, fat: 0 };

document.getElementById("caloriesValue").textContent = macroBox.calories;
document.getElementById("proteinValue").textContent = macroBox.protein + "g";
document.getElementById("carbsValue").textContent = macroBox.carbs + "g";
document.getElementById("fatValue").textContent = macroBox.fat + "g";

