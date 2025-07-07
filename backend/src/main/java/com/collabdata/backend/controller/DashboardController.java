package com.collabdata.backend.controller;

import com.collabdata.backend.dto.DashboardRequest;
import com.collabdata.backend.model.Dashboard;
import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.model.User;
import com.collabdata.backend.repository.DashboardRepository;
import com.collabdata.backend.repository.DatasetRepository;
import com.collabdata.backend.security.LoggedInUserProvider;
import com.collabdata.backend.exception.DatasetException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    private final DashboardRepository dashboardRepo;
    private final DatasetRepository datasetRepo;
    private final LoggedInUserProvider userProvider;

    public DashboardController(DashboardRepository dashboardRepo, DatasetRepository datasetRepo, LoggedInUserProvider userProvider) {
        this.dashboardRepo = dashboardRepo;
        this.datasetRepo = datasetRepo;
        this.userProvider = userProvider;
    }

    @PostMapping
    public Dashboard createDashboard(@RequestBody DashboardRequest request) {
        logger.info("📊 Creating dashboard for dataset {}: {}", request.getDatasetId(), request.getName());

        User user = userProvider.getCurrentUser();
        Dataset dataset = datasetRepo.findById(request.getDatasetId())
                .orElseThrow(() -> new DatasetException("Dataset not found: " + request.getDatasetId()));

        Dashboard dashboard = new Dashboard();
        dashboard.setName(request.getName());
        dashboard.setDataset(dataset);
        dashboard.setOwner(user);
        dashboard.setConfig(request.getConfig());

        Dashboard saved = dashboardRepo.save(dashboard);
        logger.info("✅ Dashboard saved with ID {}", saved.getId());

        return saved;
    }

    @GetMapping
    public List<Dashboard> getUserDashboards() {
        User user = userProvider.getCurrentUser();
        return dashboardRepo.findByOwner(user);
    }

    @GetMapping("/dataset/{datasetId}")
    public List<Dashboard> getDashboardsByDataset(@PathVariable UUID datasetId) {
        Dataset dataset = datasetRepo.findById(datasetId)
                .orElseThrow(() -> new DatasetException("Dataset not found: " + datasetId));
        return dashboardRepo.findByDataset(dataset);
    }
}
