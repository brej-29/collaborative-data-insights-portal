package com.collabdata.backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "charts")
public class Chart {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;
    private String chartType;
    private String xField;
    private String yField;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dataset_id")
    private Dataset dataset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getChartType() { return chartType; }
    public String getxField() { return xField; }
    public String getyField() { return yField; }
    public void setId(UUID id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setChartType(String chartType) { this.chartType = chartType; }
    public void setxField(String xField) { this.xField = xField; }
    public void setyField(String yField) { this.yField = yField; }
    public Dataset getDataset() { return dataset; }
    public void setDataset(Dataset dataset) { this.dataset = dataset; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}

