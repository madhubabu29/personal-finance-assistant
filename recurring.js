// recurring.js
export function findRecurringTransactions(transactions) {
  // Group by payee/desc + category
  const grouped = {};
  transactions.forEach(tx => {
    const key = (tx._desc || '').toLowerCase().trim() + '|' + (tx._category || '');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(tx);
  });

  // Recurring = at least 3 transactions, each spaced ~25-35 days apart
  const recurring = [];
  Object.values(grouped).forEach(group => {
    if (group.length < 3) return;
    const dates = group
      .map(g => new Date(g._date))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a - b);
    if (dates.length < 3) return;

    // Check if most intervals are ~monthly
    let monthlyCount = 0;
    for (let i = 1; i < dates.length; ++i) {
      const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff > 20 && diff < 40) monthlyCount++;
    }
    if (monthlyCount >= dates.length - 2) {
      // Mark all tx in this group as recurring
      recurring.push(...group);
    }
  });
  // Remove duplicates
  const seen = new Set();
  return recurring.filter(tx => {
    const key = [tx._date, tx._desc, tx._amount].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
