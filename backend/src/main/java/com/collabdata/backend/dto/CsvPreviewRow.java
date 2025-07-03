package com.collabdata.backend.dto;

import java.util.Map;

public class CsvPreviewRow {
    private Map<String, String> row;

    public CsvPreviewRow() {}

    public CsvPreviewRow(Map<String, String> row) {
        this.row = row;
    }

    public Map<String, String> getRow() {
        return row;
    }

    public void setRow(Map<String, String> row) {
        this.row = row;
    }
}
