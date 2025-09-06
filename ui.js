// ui.js
import { getCustomCategoryMap, setCategoryForDesc } from './storage.js';
import { categorize } from './parser.js';

export const DEFAULT_CATEGORIES = [
  "Grocery", "Food & Drink", "Shopping", "Home Maintenance", "Transport", "Entertainment", "Utilities",
  "Insurance", "Income", "Medical", "Cash", "Bank Transfer", "Other"
];

let currentSort = { col: null, asc: true };

export function renderFilters(categories, payees) {
  document.getElementById('filters').style.display = "flex";
  const catSel = document.getElementById('categoryFilter');
  catSel.innerHTML = '<option>All</option>' + Array.from(categories).sort().map(c => `<option>${c}</option>`).join('');
  const payeeSel = document.getElementById('payeeFilter');
  payeeSel.innerHTML = '<option>All</option>' + Array.from(payees).sort().map(p => `<option>${p}</option>`).join('');
  document.getElementById('startDate').value = "";
  document.getElementById('endDate').value = "";
}

export function renderSummary(income, expense, net) {
  document.getElementById('summary').innerHTML = `
    <span><b>Total Income:</b> $${income.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
    <span><b>Total Expenses:</b> $${Math.abs(expense).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
    <span><b>Net Cash Flow:</b> $${(net).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
  `;
}

export function renderTable(rows, allCategories, updateCategoryCallback) {
  const tableDiv = document.getElementById('csv-table');
  if (!rows.length) {
    tableDiv.innerHTML = '<h3>All Transactions</h3><p>No transactions to display.</p>';
    return;
  }
  const headers = Object.keys(rows[0] || {}).slice(0, 20);
  let output = '<h3>All Transactions</h3>';
  output += '<table id="main-txn-table"><thead><tr>';
  headers.forEach((header, idx) => {
    // Add sort arrow if currently sorted
    let arrow = '';
    if (currentSort.col === header) {
      arrow = currentSort.asc ? ' ▲' : ' ▼';
    }
    output += `<th data-col="${header}">${header}${arrow}</th>`;
  });
  output += '<th>Category (Edit)</th></tr></thead><tbody>';
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    output += '<tr>';
    for (const header of headers) output += `<td>${row[header] || ''}</td>`;
    output += `<td>
      <select data-rowidx="${i}" class="cat-edit-select">
        ${DEFAULT_CATEGORIES.map(cat => `<option value="${cat}"${row._category === cat ? " selected" : ""}>${cat}</option>`).join('')}
      </select>
    </td>`;
    output += '</tr>';
  }
  output += '</tbody></table>';
  tableDiv.innerHTML = output;

  // Category change event
  document.querySelectorAll('.cat-edit-select').forEach(sel => {
    sel.addEventListener('change', function() {
      const idx = parseInt(sel.getAttribute('data-rowidx'));
      const newCat = sel.value;
      const desc = rows[idx]._desc;
      setCategoryForDesc(desc, newCat);
      updateCategoryCallback(desc, newCat);
    });
  });

  // Header sort events
  tableDiv.querySelectorAll('th[data-col]').forEach((th, idx) => {
    th.style.cursor = 'pointer';
    th.onclick = () => {
      const col = th.getAttribute('data-col');
      sortTableByColumn(rows, col, headers, allCategories, updateCategoryCallback);
    };
  });
}

function sortTableByColumn(rows, col, headers, allCategories, updateCategoryCallback) {
  if (currentSort.col === col) currentSort.asc = !currentSort.asc;
  else { currentSort.col = col; currentSort.asc = true; }
  rows.sort((a, b) => {
    let av = a[col] || '';
    let bv = b[col] || '';
    // Numeric sort if possible
    if (!isNaN(av) && !isNaN(bv)) {
      av = parseFloat(av);
      bv = parseFloat(bv);
    }
    if (av < bv) return currentSort.asc ? -1 : 1;
    if (av > bv) return currentSort.asc ? 1 : -1;
    return 0;
  });
  // Re-render table only
  renderTable(rows, allCategories, updateCategoryCallback);
}

export function renderRecurringTable(rows) {
  const recurringDiv = document.getElementById('recurring-table');
  if (!rows.length) {
    recurringDiv.innerHTML = '';
    return;
  }
  const headers = Object.keys(rows[0] || {}).slice(0, 20);
  let output = '<h3>Recurring Transactions</h3>';
  output += '<table><thead><tr>';
  for (const header of headers) output += `<th>${header}</th>`;
  output += '<th>Category</th></tr></thead><tbody>';
  for (const row of rows) {
    output += '<tr>';
    for (const header of headers) output += `<td>${row[header] || ''}</td>`;
    output += `<td>${row._category || ''}</td>`;
    output += '</tr>';
  }
  output += '</tbody></table>';
  recurringDiv.innerHTML = output;
}

export function renderRecommendations(recommendations) {
  const div = document.getElementById('recommendations');
  if (!div) return;
  div.innerHTML = `
    <h3>Spending Recommendations</h3>
    <ul>
      ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
  `;
}
