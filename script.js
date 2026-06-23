// 設定：若要儲存購物清單，請把 GAS_URL 換成你部署後的 Apps Script Web App URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwmpT4kLNO10xcqzL4Yt6kmuofVsGrR9WR0W-Yb6k9_o2ykgY6kXc61Xckg_4tHWdI-qg/exec';
const RECIPES_API = 'recipes.json';

const DEFAULT_RECIPES = [
  {
    name: '紅燒豆腐',
    area: '台灣',
    category: '家常料理',
    instructions: '先將豆腐切塊，熱鍋加油，爆香蔥薑蒜，加入豆瓣醬和醬油翻炒，放入豆腐和少許水炖煮，最後加糖調味並勾薄芡即可。',
    image: 'https://images.unsplash.com/photo-1604909053613-09d682a5b970?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    ingredients: [
      '嫩豆腐 1 塊',
      '蔥 1 根',
      '薑 3 片',
      '蒜 2 瓣',
      '豆瓣醬 1 大匙',
      '醬油 1 大匙',
      '糖 1 小匙',
      '水 適量'
    ]
  },
  {
    name: '蒜香炒青菜',
    area: '台灣',
    category: '蔬菜',
    instructions: '熱鍋加油，放入蒜末爆香，加入青菜拌炒，調入鹽和少許香油，炒至蔬菜熟透即可。',
    image: 'https://images.unsplash.com/photo-1512058564366-c9e4fc7b83c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    ingredients: [
      '青江菜 1 把',
      '蒜 3 瓣',
      '鹽 1/2 小匙',
      '香油 1/2 小匙'
    ]
  },
  {
    name: '番茄蛋花湯',
    area: '台灣',
    category: '湯品',
    instructions: '番茄切塊煮滾，加少許水和鹽調味，打入蛋液攪拌成蛋花，最後撒蔥花即可。',
    image: 'https://images.unsplash.com/photo-1605650527365-a72c2c8ebb95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    ingredients: [
      '番茄 2 顆',
      '雞蛋 2 顆',
      '蔥 1 根',
      '鹽 1/2 小匙',
      '水 600 ml'
    ]
  },
  {
    name: '三杯雞',
    area: '台灣',
    category: '家常料理',
    instructions: '雞腿肉切塊，熱鍋加麻油爆香蒜頭、薑片，加入雞肉翻炒，放入米酒、醬油和糖悶煮，最後加入九層塔拌勻即可。',
    image: 'https://images.unsplash.com/photo-1514516870920-37bd93f07e2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    ingredients: [
      '去骨雞腿肉 300g',
      '蒜頭 5 瓣',
      '薑片 5 片',
      '米酒 2 大匙',
      '醬油 2 大匙',
      '糖 1 小匙',
      '九層塔 一把',
      '麻油 2 大匙'
    ]
  },
  {
    name: '麻婆豆腐',
    area: '中國',
    category: '辣菜',
    instructions: '熱鍋加油爆香蒜末和豆瓣醬，加入絞肉炒香，再放入豆腐和少許水煮開，最後加鹽、糖調味，撒上蔥花即可。',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    ingredients: [
      '嫩豆腐 1 塊',
      '絞肉 100g',
      '蒜末 1 大匙',
      '豆瓣醬 1 大匙',
      '醬油 1 大匙',
      '鹽 1/2 小匙',
      '蔥花 適量',
      '水 100 ml'
    ]
  },
  {
    name: '三色蔬菜炒飯',
    area: '台灣',
    category: '主食',
    instructions: '熱鍋加油爆香蒜末，加入紅蘿蔔、青豆和玉米炒熟，再放入飯攪拌均勻，加入醬油調味，最後撒上蔥花即可。',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    ingredients: [
      '白飯 1 碗',
      '紅蘿蔔 1/2 根',
      '青豆 50g',
      '玉米 50g',
      '蒜末 1 大匙',
      '醬油 1 大匙',
      '蔥花 適量'
    ]
  }
];

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
const myRecipesSection = document.getElementById('myRecipesSection');
const myRecipesList = document.getElementById('myRecipesList');

let recipesData = [];
let customRecipes = [];
let currentMeal = null;
let editingIndex = null;

loadCustomRecipes();
renderMyRecipes();

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

  // 若 GAS_URL 為空或開發模式，儲存到本地 localStorage
  if (!GAS_URL || GAS_URL.includes('localhost') || GAS_URL === '') {
    let shoppingLists = JSON.parse(localStorage.getItem('shoppingLists') || '[]');
    shoppingLists.push(payload);
    localStorage.setItem('shoppingLists', JSON.stringify(shoppingLists));
    alert('購物清單已儲存到本地！\n菜色：' + payload.recipe + '\n食材：' + payload.items.join('、'));
    return;
  }

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
    // 若 GAS 送出失敗，改為本地儲存
    let shoppingLists = JSON.parse(localStorage.getItem('shoppingLists') || '[]');
    shoppingLists.push(payload);
    localStorage.setItem('shoppingLists', JSON.stringify(shoppingLists));
    alert('無法連接 GAS，已改為本地儲存。請檢查 GAS_URL 是否為你部署的網址。\n菜色：' + payload.recipe + '\n食材：' + payload.items.join('、'));
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
  if (editingIndex !== null) {
    customRecipes[editingIndex] = recipe;
    saveCustomRecipes();
    renderMyRecipes();
    alert('已更新菜色！');
  } else {
    customRecipes.push(recipe);
    saveCustomRecipes();
    renderMyRecipes();
    alert('已新增菜色！');
  }

  addRecipeForm.reset();
  addRecipeSection.classList.add('hidden');
  editingIndex = null;
  setAddFormTitle('新增菜色');
  currentMeal = recipe;
  renderMeal(currentMeal);
  loadIngredientsBtn.disabled = false;
  saveListBtn.disabled = true;
  ingredientsSection.classList.add('hidden');
});

function openEditRecipe(index) {
  const recipe = customRecipes[index];
  if (!recipe) return;

  document.getElementById('newName').value = recipe.name;
  document.getElementById('newArea').value = recipe.area;
  document.getElementById('newCategory').value = recipe.category;
  document.getElementById('newInstructions').value = recipe.instructions;
  document.getElementById('newIngredients').value = recipe.ingredients.join('\n');

  editingIndex = index;
  setAddFormTitle('編輯菜色');
  addRecipeSection.classList.remove('hidden');
}

function deleteRecipe(index) {
  const recipe = customRecipes[index];
  if (!recipe) return;
  if (!confirm(`確定要刪除「${recipe.name}」嗎？`)) return;

  customRecipes.splice(index, 1);
  saveCustomRecipes();
  renderMyRecipes();

  if (currentMeal && currentMeal.name === recipe.name && currentMeal.instructions === recipe.instructions) {
    currentMeal = null;
    recipeCard.innerHTML = '<div class="placeholder">請重新產生或選擇菜色</div>';
    loadIngredientsBtn.disabled = true;
    saveListBtn.disabled = true;
    ingredientsSection.classList.add('hidden');
  }
}

function setAddFormTitle(title) {
  const heading = addRecipeSection.querySelector('h2');
  if (heading) heading.textContent = title;
}

function renderMyRecipes() {
  if (!customRecipes.length) {
    myRecipesSection.classList.add('hidden');
    myRecipesList.innerHTML = '';
    return;
  }

  myRecipesSection.classList.remove('hidden');
  myRecipesList.innerHTML = customRecipes.map((recipe, index) => `
    <li>
      <span>${escapeHtml(recipe.name)}</span>
      <div class="recipe-actions">
        <button type="button" class="small-btn edit-btn" data-index="${index}">編輯</button>
        <button type="button" class="small-btn delete-btn" data-index="${index}">刪除</button>
      </div>
    </li>
  `).join('');

  myRecipesList.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditRecipe(Number(btn.dataset.index)));
  });
  myRecipesList.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteRecipe(Number(btn.dataset.index)));
  });
}

async function loadAllRecipes() {
  if (!recipesData.length) {
    try {
      const res = await fetch(RECIPES_API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      recipesData = await res.json();
    } catch (err) {
      console.error('載入本地食譜失敗，改用內建示範食譜', err);
      alert('無法載入 recipes.json，已改用內建示範食譜。若你是直接用 file:// 開啟，請改為透過 GitHub Pages 或本機伺服器。');
      recipesData = DEFAULT_RECIPES.slice();
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
