// 設定：若要儲存購物清單，請把 GAS_URL 換成你部署後的 Apps Script Web App URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwmpT4kLNO10xcqzL4Yt6kmuofVsGrR9WR0W-Yb6k9_o2ykgY6kXc61Xckg_4tHWdI-qg/exec';
const RECIPES_API = 'recipes.json';

const randomBtn = document.getElementById('randomBtn');
const loadIngredientsBtn = document.getElementById('loadIngredientsBtn');
const saveListBtn = document.getElementById('saveListBtn');
const toggleAddBtn = document.getElementById('toggleAddBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');
const addRecipeSection = document.getElementById('addRecipeSection');
const addRecipeForm = document.getElementById('addRecipeForm');
const recipeCard = document.getElementById('recipeCard');
const ingredientsSection = document.getElementById('ingredientsSection');
const ingredientsList = document.getElementById('ingredientsList');

let recipesData = [];
let customRecipes = [];
let currentMeal = null;

loadCustomRecipes();

randomBtn.addEventListener('click', async () => {
  recipeCard.innerHTML = '<div class="placeholder">載入中…</div>';
  const allRecipes = await loadAllRecipes();
  if (!allRecipes.length) {
    recipeCard.innerHTML = '<div class="placeholder">沒有可用的菜色</div>';
    return;
  }

  currentMeal = allRecipes[Math.floor(Math.random() * allRecipes.length)];
  renderMeal(currentMeal);
  loadIngredientsBtn.disabled = false;
  saveListBtn.disabled = true;
  ingredientsSection.classList.add('hidden');
});

loadIngredientsBtn.addEventListener('click', () => {
  if (!currentMeal) return;
  const ingredients = extractIngredients(currentMeal);
  renderIngredients(ingredients);
  ingredientsSection.classList.remove('hidden');
  saveListBtn.disabled = false;
});

saveListBtn.addEventListener('click', async () => {
  const checked = Array.from(document.querySelectorAll('#ingredientsList input[type=checkbox]:checked')).map(i => i.value);
  if (!checked.length) return alert('請選擇至少一樣食材。');

  const payload = {
    recipe: currentMeal ? currentMeal.name : '未知',
    items: checked,
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    alert('已送出：' + text);
  } catch (err) {
    console.error(err);
    alert('送出失敗，請檢查 GAS_URL 是否為你部署的網址。');
  }
});

toggleAddBtn.addEventListener('click', () => {
  addRecipeSection.classList.toggle('hidden');
});

cancelAddBtn.addEventListener('click', () => {
  addRecipeSection.classList.add('hidden');
  addRecipeForm.reset();
});

addRecipeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('newName').value.trim();
  const area = document.getElementById('newArea').value.trim();
  const category = document.getElementById('newCategory').value.trim();
  const instructions = document.getElementById('newInstructions').value.trim();
  const ingredients = document.getElementById('newIngredients').value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (!name || !instructions || !ingredients.length) {
    return alert('請填寫名稱、做法與至少一個食材。');
  }

  const recipe = { name, area, category, instructions, ingredients };
  customRecipes.push(recipe);
  saveCustomRecipes();
  addRecipeForm.reset();
  addRecipeSection.classList.add('hidden');
  alert('已新增菜色！');
  currentMeal = recipe;
  renderMeal(currentMeal);
  loadIngredientsBtn.disabled = false;
  saveListBtn.disabled = true;
  ingredientsSection.classList.add('hidden');
});

async function loadAllRecipes() {
  if (!recipesData.length) {
    try {
      const res = await fetch(RECIPES_API);
      recipesData = await res.json();
    } catch (err) {
      console.error('載入本地食譜失敗', err);
      recipesData = [];
    }
  }
  return [...recipesData, ...customRecipes];
}

function loadCustomRecipes() {
  const raw = localStorage.getItem('customRecipes');
  if (raw) {
    try {
      customRecipes = JSON.parse(raw);
    } catch (err) {
      customRecipes = [];
    }
  }
}

function saveCustomRecipes() {
  localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
}

function renderMeal(meal) {
  const html = `
    <div class="meal">
      <h2>${escapeHtml(meal.name)}</h2>
      <p><strong>菜系：</strong>${escapeHtml(meal.area || '')} • <strong>分類：</strong>${escapeHtml(meal.category || '')}</p>
      <img src="${meal.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'}" alt="${escapeHtml(meal.name)}" style="max-width:160px;border-radius:8px;float:right;margin-left:12px">
      <p>${escapeHtml(meal.instructions)}</p>
    </div>
  `;
  recipeCard.innerHTML = html;
}

function extractIngredients(meal) {
  return meal.ingredients || [];
}

function renderIngredients(items) {
  ingredientsList.innerHTML = '';
  items.forEach((it) => {
    const li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox" value="${escapeHtml(it)}"> ${escapeHtml(it)}</label>`;
    ingredientsList.appendChild(li);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}
