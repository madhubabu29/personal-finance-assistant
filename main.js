// main.js
import { guessAmount, getDate, getDesc, categorize } from './parser.js';
import { getCustomCategoryMap } from './storage.js';
import { drawCategoryPie, drawTrendChart } from './charts.js';
import { renderFilters, renderSummary, renderTable, DEFAULT_CATEGORIES } from './ui.js';
import { findRecurringTransactions } from './recurring.js';
import { renderRecurringTable } from './ui.js';

let originalRows = [], mergedRows = [], allCategories = new Set(), allPayees = new Set();

function processAndRender(rows) {
  const seen = new Set();
  mergedRows = [];
  allCategories.clear();
  allPayees.clear();
  for (const row of rows) {
    const amount = guessAmount(row);
    const date = getDate(row) || '';
    const desc = getDesc(row) || '';
    const category = categorize(desc);
    const key = [date, desc, amount].join('|');
    if (!seen.has(key)) {
      seen.add(key);
      mergedRows.push({...row, _amount: amount, _date: date, _desc: desc, _category: category});
      if (category !== "Income") allCategories.add(category);
      if (desc) allPayees.add(desc);
    }
  }
  renderFilters(allCategories, allPayees);
  renderEverything();
}

function filterRows() {
  const cat = document.getElementById('categoryFilter').value;
  const payee = document.getElementById('payeeFilter').value;
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  return mergedRows.filter(row => {
    let ok = true;
    if (cat && cat !== "All" && row._category !== cat) ok = false;
    if (payee && payee !== "All" && row._desc !== payee) ok = false;
    if (start) {
      let d = new Date(row._date);
      let ds = new Date(start);
      if (!isNaN(d.getTime()) && d < ds) ok = false;
    }
    if (end) {
      let d = new Date(row._date);
      let de = new Date(end);
      if (!isNaN(d.getTime()) && d > de) ok = false;
    }
    return ok;
  });
}

function renderEverything() {
  const rows = filterRows();
  let income = 0, expense = 0;
  for (const row of rows) {
    const amt = row._amount;
    if (amt > 0) income += amt;
    else if (amt < 0) expense += amt;
  }
  renderSummary(income, expense, income + expense);

  // Charts
  const categoryTotals = {}, monthlyTotals = {};
  rows.forEach(row => {
    const amt = row._amount;
    if (amt < 0) {
      categoryTotals[row._category] = (categoryTotals[row._category] || 0) + Math.abs(amt);
      let d = new Date(row._date);
      let month = !isNaN(d.getTime()) ? `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}` : (row._date||'').substring(0,7);
      monthlyTotals[month] = (monthlyTotals[month] || 0) + Math.abs(amt);
    }
  });
  const catLabels = Object.keys(categoryTotals);
  const catData = Object.values(categoryTotals);
  drawCategoryPie(document.getElementById('categoryChart').getContext('2d'), catLabels, catData);

  const sortedMonths = Object.keys(monthlyTotals).sort();
  const trendData = sortedMonths.map(m => monthlyTotals[m]);
  drawTrendChart(document.getElementById('trendChart').getContext('2d'), sortedMonths, trendData);
  //added new for recurring
  const recurringRows = findRecurringTransactions(rows);
  renderRecurringTable(recurringRows);
  
  // Table with editable category
  renderTable(rows, allCategories, (desc, newCat) => {
    mergedRows.forEach(r => { if (r._desc === desc) r._category = newCat; });
    allCategories.add(newCat);
    renderFilters(allCategories, allPayees);
    renderEverything();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('csvFiles').addEventListener('change', function(event) {
    const files = event.target.files;
    if (!files.length) return;
    let allRows = [], fileCount = 0, filesToParse = files.length;
    for (let i = 0; i < files.length; i++) {
      Papa.parse(files[i], {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          allRows = allRows.concat(results.data.filter(row => Object.values(row).join('').trim() !== ''));
          fileCount++;
          if (fileCount === filesToParse) {
            originalRows = allRows;
            processAndRender(originalRows);
          }
        }
      });
    }
  });

  document.getElementById('filters').addEventListener('change', renderEverything);
  document.getElementById('resetFilters').addEventListener('click', function() {
    renderFilters(allCategories, allPayees);
    renderEverything();
  });
});
