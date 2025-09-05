// parser.js
export function guessAmount(row) {
  let amountValue = null;
  for (const key of Object.keys(row)) {
    if (key.toLowerCase().includes('amount')) {
      amountValue = row[key];
      break;
    }
  }
  if (!amountValue) return 0;
  let amtStr = (amountValue + '').replace(/[\$,]/g, '').trim();

  if (/^\(\s*[\d\.,]+\s*\)$/.test(amtStr)) {
    amtStr = '-' + amtStr.replace(/[()\s]/g, '');
  }
  if (amtStr.startsWith('(') && amtStr.endsWith(')')) {
    amtStr = '-' + amtStr.substring(1, amtStr.length - 1);
  }
  amtStr = amtStr.replace(/\s/g, '');

  let amt = parseFloat(amtStr);
  if (isNaN(amt)) amt = 0;

  if (row['Master Category'] && /payment|credit|refund/i.test(row['Master Category'])) {
    amt = -Math.abs(amt);
  }
  return amt;
}

export function getDate(row) {
  for (const key of Object.keys(row)) {
    if (key.toLowerCase().includes('date')) return row[key];
  }
  return '';
}

export function getDesc(row) {
  for (const key of Object.keys(row)) {
    if (key.toLowerCase().includes('desc') || key.toLowerCase().includes('payee') || key.toLowerCase().includes('merchant')) return row[key];
  }
  return '';
}

export function categorize(desc) {
  if (!desc) return "Other";
  const map = JSON.parse(localStorage.getItem('customCategoryMap') || '{}');
  if (map[desc]) return map[desc];

  const d = desc.toLowerCase();
  if (/grocery|groceries|costco|kroger|tom thumb|supermarket/.test(d)) return "Grocery";
  if (/starbucks|coffee|cafe|restaurant|food|eat|drink|dining/.test(d)) return "Food & Drink";
  if (/amazon|shopping|store|mall|target|walmart/.test(d)) return "Shopping";
  if (/maintenance|repair|home depot|lowe's|filter|window clean|pest control|lawn|garden/.test(d)) return "Home Maintenance";
  if (/uber|lyft|taxi|transport|bus|train|transit|metro|flight|airlines|airline/.test(d)) return "Transport";
  if (/netflix|hulu|prime|entertainment|movie|cinema|spotify/.test(d)) return "Entertainment";
  if (/utility|electric|water|gas|internet|phone|cable/.test(d)) return "Utilities";
  if (/insurance/.test(d)) return "Insurance";
  if (/salary|payroll|paycheck|income|deposit/.test(d)) return "Income";
  if (/medical|health|doctor|hospital|pharmacy/.test(d)) return "Medical";
  if (/atm|cash/.test(d)) return "Cash";
  if (/bank|transfer/.test(d)) return "Bank Transfer";
  return "Other";
}
