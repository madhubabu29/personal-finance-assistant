// recurring.js
export function findRecurringTransactions(transactions) {
  const grouped = {};
  transactions.forEach(tx => {
    const key = (tx._desc || '').toLowerCase().trim() + '|' + (tx._category || '');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(tx);
  });

  const recurring = [];
  Object.values(grouped).forEach(group => {
    if (group.length < 3) return;
    const dates = group
      .map(g => new Date(g._date))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a - b);
    if (dates.length < 3) return;

    let monthlyCount = 0;
    for (let i = 1; i < dates.length; ++i) {
      const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff > 20 && diff < 40) monthlyCount++;
    }
    if (monthlyCount >= dates.length - 2) {
      recurring.push(...group);
    }
  });
  const seen = new Set();
  return recurring.filter(tx => {
    const key = [tx._date, tx._desc, tx._amount].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
