// ui.js
import { getCustomCategoryMap, setCategoryForDesc } from './storage.js';
import { categorize } from './parser.js';

export const DEFAULT_CATEGORIES = [
  "Food & Drink", "Shopping", "Transport", "Entertainment", "Rent", "Utilities",
  "Insurance", "Income", "Medical", "Cash", "Bank Transfer", "Other"
];

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
  const headers = Object.keys(rows[0] || {}).slice(0, 20);
  let output = '<table><thead><tr>';
  for (const header of headers) output += `<th>${header}</th>`;
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
  document.getElementById('csv-table').innerHTML = output;
  // Event listeners
  document.querySelectorAll('.cat-edit-select').forEach(sel => {
    sel.addEventListener('change', function() {
      const idx = parseInt(sel.getAttribute('data-rowidx'));
      const newCat = sel.value;
      const desc = rows[idx]._desc;
      setCategoryForDesc(desc, newCat);
      updateCategoryCallback(desc, newCat);
    });
  });
}
export function renderRecurringTable(rows) {
  if (!rows.length) {
    document.getElementById('recurring-table').innerHTML = '';
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
  document.getElementById('recurring-table').innerHTML = output;
}

