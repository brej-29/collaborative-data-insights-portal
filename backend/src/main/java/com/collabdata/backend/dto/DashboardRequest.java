package com.collabdata.backend.dto;

import java.util.UUID;

public class DashboardRequest {
    private String name;
    private UUID datasetId;
    private String config;

    public String getName(){
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public UUID getDatasetId() {
        return datasetId;
    }
    public void setDatasetId(UUID datasetId) {
        this.datasetId = datasetId;
    }
    public String getConfig() {
        return config;
    }
    public void setConfig(String config) {
        this.config = config;
    }
}
