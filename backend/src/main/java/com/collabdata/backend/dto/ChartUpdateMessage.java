package com.collabdata.backend.dto;

public class ChartUpdateMessage {
    @SuppressWarnings("unused")
    private String datasetId;
    private String chartId;
    private String type; // e.g., "ADD", "UPDATE", "DELETE"
    private Object payload;

    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    public String getChartId() {
        return chartId;
    }

    public void setChartId(String chartId) {
        this.chartId = chartId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
