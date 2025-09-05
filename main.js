<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Personal Finance Assistant</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body>
  <h1>Personal Finance Assistant</h1>
  <p style="margin-bottom: 0.8em;">Upload your bank or credit card CSV statements below.</p>
  <input type="file" id="csvFiles" multiple accept=".csv" />
  <div class="filters" id="filters" style="display:none;">
    <label for="categoryFilter">Category:</label>
    <select id="categoryFilter"></select>
    <label for="payeeFilter">Payee:</label>
    <select id="payeeFilter"></select>
    <label for="startDate">From:</label>
    <input type="date" id="startDate" />
    <label for="endDate">To:</label>
    <input type="date" id="endDate" />
    <button id="resetFilters" style="margin-left:1em;">Reset</button>
  </div>
  <div class="summary" id="summary"></div>
  <div id="recommendations"></div>
  <div class="charts">
    <div class="chart-container">
      <h3 style="font-size:1.07em;">Expenses by Category</h3>
      <canvas id="categoryChart" width="350" height="350"></canvas>
    </div>
    <div class="chart-container">
      <h3 style="font-size:1.07em;">Monthly Expense Trend</h3>
      <canvas id="trendChart" width="420" height="350"></canvas>
    </div>
  </div>
  <div id="recurring-table"></div>
  <div id="csv-table"></div>
  <script type="module" src="main.js"></script>
</body>
</html>
