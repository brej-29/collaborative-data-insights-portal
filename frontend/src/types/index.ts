export interface CsvPreviewRow {
  row: Record<string, string>;
}

export interface CsvUploadResponse {
  message: string;
  headers: string[];
  preview: CsvPreviewRow[];
}
