export interface CsvPreviewRow {
  row: Record<string, string>;
}

export interface CsvUploadResponse {
  message: string;
  headers: string[];
  preview: CsvPreviewRow[];
}

export interface ChartUpdateMessage {
  type: "chart_update";
  chartId: string;
  datasetId: string;
  config: {
    title?: string;
    xField?: string;
    yField?: string | null;
  };
}

export type WebSocketMessage = ChartUpdateMessage /* | ChartDeleteMessage | ChartCreateMessage etc. */;

