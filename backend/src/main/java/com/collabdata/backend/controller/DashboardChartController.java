package com.collabdata.backend.controller;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.collabdata.backend.model.Dashboard;
import com.collabdata.backend.model.DashboardChart;
import com.collabdata.backend.repository.DashboardChartRepository;
import com.collabdata.backend.repository.DashboardRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/dashboards/{dashboardId}/charts")
public class DashboardChartController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardChartController.class);
    private final DashboardChartRepository chartRepo;
    private final DashboardRepository dashboardRepo;

    public DashboardChartController(DashboardChartRepository chartRepo, DashboardRepository dashboardRepo) {
        this.chartRepo = chartRepo;
        this.dashboardRepo = dashboardRepo;
    }

    @GetMapping
    public List<DashboardChart> getCharts(@PathVariable UUID dashboardId) {
        logger.info("Fetching charts for dashboard {}", dashboardId);
        return chartRepo.findByDashboardId(dashboardId);
    }

    @PostMapping
    public DashboardChart addChart(@PathVariable UUID dashboardId, @RequestBody DashboardChart chart) {
        try {
            Dashboard dashboard = dashboardRepo.findById(dashboardId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dashboard not found"));
            chart.setDashboard(dashboard);
            chart.setData(new ObjectMapper().writeValueAsString(chart.getData()));
            return chartRepo.save(chart);
        } catch (Exception e) {
            logger.error("Failed to save chart", e); // logs full stack trace
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save chart", e);
        }
    }

    @DeleteMapping("/{chartId}")
    public void deleteChart(@PathVariable UUID chartId) {
        chartRepo.deleteById(chartId);
    }
}
