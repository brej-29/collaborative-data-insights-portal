export function buildPrompt(
  headers: string[],
  sampleRows: Record<string, any>[],
  summary?: Record<string, any>
): string {
  const fieldsList = headers.join(", ");
  const summaryBlock = summary
    ? `Column Summary:\n${JSON.stringify(summary, null, 2)}\n`
    : "";

  return `
You are a data visualization assistant. 

Given:
- Columns: ${fieldsList}
${summaryBlock}
- Sample Data (first 5 rows):
${JSON.stringify(sampleRows.slice(0, 5), null, 2)}

Your task:
Return exactly 5 useful chart configurations as a pure JSON array.

Each object must include:
- "title" (descriptive string)
- "chartType" (one of: bar, line, pie, doughnut, scatter, area, radar, histogram)
- "xField" (must be a valid column name)
- "yField" (only include if the chart type needs it; use null or omit if not needed)

Output format:
[
  {
    "title": "Title of the chart",
    "chartType": "bar",
    "xField": "column_name",
    "yField": "column_name or null"
  },
  ...
]

Rules:
- Respond with a valid JSON array ONLY. No text, comments, or code blocks.
- Do not use markdown, triple backticks, or explanation.
- Avoid fields like "undefined", "empty", or "".
- All field values must be non-empty valid strings or null.
  `.trim();
}
