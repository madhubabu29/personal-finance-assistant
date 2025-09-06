// charts.js
let categoryChart, trendChart;

export function drawCategoryPie(ctx, labels, data, totalSpend) {
  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc949",
          "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"
        ]
      }]
    },
    options: {
      plugins: {
        legend: { position: 'right' },
        tooltip: { enabled: true },
        // custom center label plugin
        doughnutCenterText: {
          display: true,
          text: `$${totalSpend.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`,
          subtext: 'Total Spend'
        }
      },
      cutout: '65%'
    },
    plugins: [doughnutCenterTextPlugin]
  });
}

// Plugin to render center text (total spend)
const doughnutCenterTextPlugin = {
  id: 'doughnutCenterText',
  afterDraw(chart, args, options) {
    if (!options.display) return;
    const { ctx, chartArea } = chart;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.font = 'bold 1.3em Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#222';
    ctx.fillText(options.text || '', centerX, centerY);

    if (options.subtext) {
      ctx.font = '0.95em Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(options.subtext, centerX, centerY + 22);
    }
    ctx.restore();
  }
};

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
