window.AN = (() => {
const SAMPLES = [
  { id: 'retail', name: 'Retail orders (relational)', files: [
    { name: 'orders.csv', size: 412000, rows: 8240, cols: 7, keys: ['orderID', 'productID'] },
    { name: 'products.csv', size: 38600, rows: 310, cols: 5, keys: ['productID', 'categoryID'] },
    { name: 'categories.csv', size: 1200, rows: 8, cols: 3, keys: ['categoryID'] } ] },
  { id: 'events', name: 'Event attendance', files: [ { name: 'event_attendance.csv', size: 226000, rows: 5112, cols: 9, keys: ['eventID'], pii: ['phone', 'email'] } ] },
];
const EXAMPLES = [
  'Summarize the key trends and the most important drivers in this data.',
  'What are the top segments by value, and how do they differ?',
  'Are there any anomalies or outliers I should investigate?',
];
const STAGES = [
  { key: 'setup', label: 'Setting up environment', cmd: 'mkdir -p ./workspace/data ./workspace/charts && cp /.agents/data/*.csv ./workspace/data/ && pip install -r /.agents/requirements.txt' },
  { key: 'load', label: 'Loading dataset', cmd: 'cat /.agents/skills/*/SKILL.md' },
  { key: 'profile', label: 'Profiling tables', cmd: 'python3 profile.py  →  data/profile.json' },
  { key: 'analyze', label: 'Analyzing', cmd: 'python3 analysis.py  # pandas merge · groupby · resample' },
  { key: 'charts', label: 'Rendering charts', cmd: 'python3 make_chart.py --type bar --data data/analysis/revenue_by_category.csv' },
  { key: 'charts2', label: 'Rendering charts', cmd: 'python3 make_chart.py --type line --data data/analysis/monthly_revenue.csv' },
  { key: 'report', label: 'Compiling report', cmd: 'python3 build_report.py --workspace ./workspace  →  Report saved' },
];
const THOUGHTS = [
  'Three tables share productID and categoryID — orders joins to products, products to categories.',
  'orderDate parses cleanly for 8,231 of 8,240 rows; 9 unparseable dates kept as missing.',
  'Question is descriptive — no model needed. Aggregating revenue by category and month.',
  'Top two categories carry most of the revenue; checking month-on-month seasonality.',
];
const REPORT = {
  dataset_name: 'Retail orders (relational)',
  question: EXAMPLES[0],
  title: 'Revenue is concentrated in two categories, with a strong Q4 peak',
  executive_summary: 'Beverages and Dairy account for 54% of revenue across 8,240 orders. Revenue peaks in November–December at 1.6× the monthly average, and average order value rose 12% year on year while order count stayed flat — growth is coming from basket size, not new orders.',
  insights: [
    { title: 'Two categories dominate', detail: 'Beverages (31%) and Dairy (23%) lead; the bottom four categories together contribute 14%.', metric: 'Top-2 share', value: '54%' },
    { title: 'Q4 seasonality', detail: 'November and December revenue is 1.6× the 12-month average; January drops 38% from December.', metric: 'Peak vs avg', value: '1.6×' },
    { title: 'Basket size drives growth', detail: 'Average order value grew from R412 to R461 while monthly order count was flat (±3%).', metric: 'AOV change', value: '+12%' },
    { title: 'Data quality', detail: '9 orders have unparseable dates and 14 reference a productID missing from products.csv; excluded from trends.', metric: 'Rows excluded', value: '23' },
  ],
  byCategory: [['Beverages', 1.42], ['Dairy', 1.05], ['Confections', 0.71], ['Seafood', 0.58], ['Condiments', 0.33], ['Grains', 0.24], ['Produce', 0.19], ['Meat', 0.11]],
  monthly: [0.31, 0.29, 0.33, 0.34, 0.36, 0.35, 0.37, 0.38, 0.40, 0.44, 0.58, 0.61],
  table: { title: 'Top products by revenue', columns: ['Product', 'Category', 'Orders', 'Revenue (R m)'], rows: [['Rooibos 80s', 'Beverages', 612, '0.38'], ['Full-cream milk 2L', 'Dairy', 1104, '0.31'], ['Filter coffee 1kg', 'Beverages', 287, '0.27'], ['Cheddar 900g', 'Dairy', 402, '0.22'], ['Rusks 500g', 'Confections', 518, '0.19']] },
  methodology: 'Joined orders → products → categories on productID and categoryID. Revenue = quantity × unitPrice. Monthly trend resampled on orderDate. Descriptive analysis only; no predictive model was fitted.',
  recommendations: ['Plan stock and staffing for the November–December peak from September.', 'Investigate the 14 orphaned productIDs before the next reporting cycle.', 'Test bundles in Confections and Seafood to lift their share of basket size.'],
  generated_at: '2026-11-02',
};
const HISTORY = [
  { id: 'run_0187', title: REPORT.title, question: REPORT.question, dataset: 'Retail orders (relational)', when: '2026-11-02 09:41', calls: 7, status: 'done', followUps: 1 },
  { id: 'run_0182', title: 'Attendance falls 22% for weekday-evening events', question: 'Which event times get the best attendance?', dataset: 'Event attendance', when: '2026-10-30 15:12', calls: 8, status: 'done', followUps: 0 },
  { id: 'run_0179', title: 'Dataset cannot answer churn question', question: 'Which members are likely to stop attending?', dataset: 'Event attendance', when: '2026-10-29 11:03', calls: 6, status: 'limited', followUps: 0 },
  { id: 'run_0174', title: 'Upload failed — file over 1 MB inline limit', question: 'Summarize the key trends…', dataset: 'orders_full.csv', when: '2026-10-28 08:55', calls: 0, status: 'error', followUps: 0 },
];
return { SAMPLES, EXAMPLES, STAGES, THOUGHTS, REPORT, HISTORY, BUDGET: 10, INLINE_MAX: 1024 * 1024 };
})();