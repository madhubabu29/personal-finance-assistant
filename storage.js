// storage.js
const CATEGORY_KEY = 'customCategoryMap';

export function getCustomCategoryMap() {
  try { return JSON.parse(localStorage.getItem(CATEGORY_KEY) || '{}'); }
  catch { return {}; }
}

export function setCustomCategoryMap(map) {
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(map));
}

export function getCategoryForDesc(desc) {
  const map = getCustomCategoryMap();
  return map[desc] || null;
}

export function setCategoryForDesc(desc, category) {
  const map = getCustomCategoryMap();
  map[desc] = category;
  setCustomCategoryMap(map);
}
