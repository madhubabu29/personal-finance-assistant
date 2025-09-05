// recommendations.js

const NATIONAL_AVERAGE = {
  "Grocery": 400,
  "Food & Drink": 400,
  "Shopping": 300,
  "Home Maintenance": 250,
  "Transport": 150,
  "Entertainment": 120,
  "Utilities": 200,
  "Insurance": 200,
  "Medical": 50,
  "Travel": 150,
  "Other": 100,
};

export function generateRecommendations(transactions) {
  const categoryTotals = {};
  const monthlyTotals = {};
  transactions.forEach(tx => {
    const amt = tx._amount;
    const cat = tx._category || "Other";
    if (amt < 0) {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(amt);
      let d = new Date(tx._date);
      let month = !isNaN(d.getTime())
        ? `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
        : (tx._date || '').substring(0, 7);
      if (!monthlyTotals[cat]) monthlyTotals[cat] = {};
      monthlyTotals[cat][month] = (monthlyTotals[cat][month] || 0) + Math.abs(amt);
    }
  });

  const sortedCats = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  const recommendations = [];

  for (let [cat, total] of sortedCats.slice(0, 3)) {
    const avg = NATIONAL_AVERAGE[cat] || 0;
    if (avg && total > avg * 1.15) {
      recommendations.push(`Your average monthly spend on <b>${cat}</b> is $${Math.round(total)}. This is higher than the typical average of $${avg}/month. Consider reviewing your spending in this category.`);
    }
  }

  for (let [cat, months] of Object.entries(monthlyTotals)) {
    const monthValues = Object.values(months);
    if (monthValues.length >= 3) {
      const latest = monthValues[monthValues.length-1];
      const prevAvg = monthValues.slice(0, -1).reduce((a, b) => a + b, 0) / (monthValues.length-1);
      if (latest > prevAvg * 1.3 && prevAvg > 0) {
        recommendations.push(`Your <b>${cat}</b> spending increased by ${Math.round(100 * (latest - prevAvg)/prevAvg)}% last month. Consider if any expenses can be reduced or avoided.`);
      }
    }
  }

  if (sortedCats.length > 0) {
    const [cat, total] = sortedCats[0];
    if (total > 500 && cat !== "Income") {
      recommendations.push(`You spend the most on <b>${cat}</b> ($${Math.round(total)}). Setting a monthly budget and tracking this category may help you save.`);
    }
  }

  if (!recommendations.length)
    recommendations.push("No specific recommendations this month. Good job managing your spending!");

  return recommendations;
}
