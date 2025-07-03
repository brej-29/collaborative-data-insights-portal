package com.collabdata.backend.dto;

import java.util.List;

public class CsvUploadResponse {
    private String message;
    private List<String> headers;
    private List<CsvPreviewRow> preview;

    public CsvUploadResponse() {}

    public CsvUploadResponse(String message, List<String> headers, List<CsvPreviewRow> preview) {
        this.message = message;
        this.headers = headers;
        this.preview = preview;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getHeaders() {
        return headers;
    }

    public List<CsvPreviewRow> getPreview() {
        return preview;
    }
}
