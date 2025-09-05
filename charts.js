// charts.js
let categoryChart, trendChart;

export function drawCategoryPie(ctx, labels, data) {
  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{ data, backgroundColor: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"] }]
    },
    options: { plugins: { legend: { position: 'right' } } }
  });
}

export function drawTrendChart(ctx, months, data) {
  if (trendChart) trendChart.destroy();
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Expenses',
        data,
        fill: false,
        borderColor: '#e15759',
        backgroundColor: '#e15759',
        tension: 0.2
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}
