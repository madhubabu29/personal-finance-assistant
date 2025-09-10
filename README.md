# Personal Finance Assistant - Requirements

## Overview

The **Personal Finance Assistant** is a web application designed to help users understand, categorize, and visualize their personal finances by uploading bank and credit card CSV statements. The app enables users to track spending, income, and recurring transactions, and to receive personalized insights and recommendations—all within their browser, without uploading data to a server.

---

## Functional Requirements

### 1. CSV Import & Parsing
- Users can upload one or more CSV files exported from banks or credit card portals.
- The app supports varying CSV formats, including those with different column names and value conventions.
- The app automatically detects and normalizes the sign of the "Amount" column, ensuring spends are always recorded as negative and income as positive, regardless of the bank’s convention.

### 2. Transaction Processing
- The app parses CSVs to extract key fields: date, payee/description, amount, and category.
- Duplicate transactions (from overlapping statements) are detected and merged.
- Transactions are categorized automatically using heuristics and a customizable mapping.
- Users can manually edit categories for individual transactions.
- All user customizations are stored locally for future sessions.

### 3. Filtering & Search
- Users can filter transactions by category, payee, and date range.
- Filters update all summary statistics, charts, and tables in real time.

### 4. Summaries & Visualizations
- The app displays total income, total expenses, and net cash flow.
- Provides a donut/pie chart of expenses by category, with the total spend in the center.
- Displays a time-based line chart of monthly spending trends.
- Highlights recurring transactions (subscriptions, bills, etc.) in a separate table.

### 5. Recommendations & Insights
- The app generates actionable recommendations (e.g., "You spent more on Food & Drink this month than last month").
- Suggestions are based on spending patterns and recurring charges.

### 6. Data Privacy & Storage
- All data processing happens locally in the browser; no financial data is uploaded to any server.
- User preferences, custom categories, and previous imports are stored in browser localStorage.

### 7. User Interface
- Responsive design for desktop and mobile.
- Clean, accessible UI with clear tables, charts, and filter controls.
- Allows the user to reset filters and re-import new CSVs at any time.

---

## Non-Functional Requirements

- **Performance:** The app should efficiently process and display several thousand transactions without noticeable lag.
- **Compatibility:** Works in all modern browsers (Chrome, Firefox, Edge, Safari).
- **Accessibility:** Meets basic accessibility standards for color contrast, keyboard navigation, and ARIA labels.
- **Extensibility:** Codebase is modular (separating parsing, storage, UI, charting, etc.) to allow for future enhancements (e.g., support for OFX, QIF, or more visualization types).

---

## Out of Scope

- No user authentication or cloud storage.
- No direct bank connection or automated statement download.
- No export of processed data (unless added as a future feature).

---

## Nice-to-Have / Stretch Goals

- Allow users to export filtered/processed transactions as CSV or Excel.
- Budgeting features (set targets per category).
- Alerting for unusual or duplicate transactions.
- Sharing anonymized insights (opt-in only).

---

## Example User Flow

1. User exports statements from their bank as CSV(s).
2. User visits the Personal Finance Assistant app and uploads the files.
3. The app processes, deduplicates, categorizes, and displays summaries, trends, and recommendations.
4. The user explores their data, adjusts categories, and reviews recurring expenses—all locally and privately.

---
