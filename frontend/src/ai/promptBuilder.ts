export function buildPrompt(headers: string[], sampleRows: Record<string, any>[]): string {
  return `
You are a data visualization assistant. 

Given:
- A dataset with the following columns: ${headers.join(", ")}
- Here are a few sample rows:
${JSON.stringify(sampleRows.slice(0, 5), null, 2)}

Suggest 5 useful charts in this format:
[
  {
    "title": "Chart Title",
    "chartType": "bar" | "line" | "pie" | "scatter" | "area" | "doughnut" | "radar" | "bubble",
    "xField": "column_name",
    "yField": "column_name"
  },
  ...
]

Only return pure JSON — do not explain anything.
  `.trim();
}
