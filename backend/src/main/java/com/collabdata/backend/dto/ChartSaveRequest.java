package com.collabdata.backend.dto;

import java.util.List;
import java.util.UUID;

public class ChartSaveRequest {
    private UUID datasetId;
    private List<ChartDto> charts;

    // Getters and setters
    public UUID getDatasetId() {
        return datasetId;
    }  
    public void setDatasetId(UUID datasetId) {
        this.datasetId = datasetId;
    }
    public List<ChartDto> getCharts() {
        return charts;
    }
    public void setCharts(List<ChartDto> charts) {
        this.charts = charts;
    }
}
