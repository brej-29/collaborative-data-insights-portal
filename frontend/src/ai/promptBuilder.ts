export function buildPrompt(headers: string[], sampleRows: Record<string, any>[]): string {
  return `
You are a data visualization assistant. 

Given:
- A dataset with the following columns: ${headers.join(", ")}
- Here are a few sample rows:
${JSON.stringify(sampleRows.slice(0, 5), null, 2)}

Suggest 5 useful and accurate chart configurations based on the following dataset.

Only return a **pure JSON array**, and ensure:
- Each object must include a valid "title", "chartType", "xField"
- "yField" must be present **only if the chart type requires it**
- If not needed (e.g. pie chart), omit "yField" or set to null
- Do **not** leave any field empty, undefined, or as a space

Format:
[
  {
    "title": "Chart title",
    "chartType": "bar" | "line" | "pie" | "scatter" | "histogram" | "doughnut" | "area" | "bubble",
    "xField": "column_name",
    "yField": "column_name or null"
  },
  ...
]

No markdown. No explanation. Just valid JSON.
  `.trim();
}
