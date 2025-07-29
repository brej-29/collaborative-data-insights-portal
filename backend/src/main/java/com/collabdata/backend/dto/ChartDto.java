package com.collabdata.backend.dto;

import java.util.UUID;

public class ChartDto {
    private UUID id;
    private String title;
    private String chartType;
    private String xField;
    private String yField;

    public ChartDto(UUID id, String title, String chartType, String xField, String yField) {
        this.id = id;
        this.title = title;
        this.chartType = chartType;
        this.xField = xField;
        this.yField = yField;
    }

    // Getters and setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getChartType() {
        return chartType;
    }
    public void setChartType(String chartType) {
        this.chartType = chartType;
    }
    public String getxField() {
        return xField;
    }
    public void setxField(String xField) {
        this.xField = xField;
    }
    public String getyField() {
        return yField;
    }
    public void setyField(String yField) {
        this.yField = yField;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

}