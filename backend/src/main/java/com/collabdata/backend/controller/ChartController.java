package com.collabdata.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.collabdata.backend.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.collabdata.backend.dto.ChartDto;
import com.collabdata.backend.dto.ChartSaveRequest;
import com.collabdata.backend.model.Chart;
import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.repository.ChartRepository;
import com.collabdata.backend.repository.DatasetRepository;
import com.collabdata.backend.security.LoggedInUserProvider;

@RestController
@RequestMapping("/api/charts")
public class ChartController {
    private static final Logger logger = LoggerFactory.getLogger(ChartController.class);
    private final ChartRepository chartRepository;
    private final DatasetRepository datasetRepository;
    private final LoggedInUserProvider userProvider;

    public ChartController(ChartRepository chartRepository, DatasetRepository datasetRepository,
            LoggedInUserProvider userProvider) {
        this.chartRepository = chartRepository;
        this.datasetRepository = datasetRepository;
        this.userProvider = userProvider;
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveCharts(@RequestBody ChartSaveRequest request) {
        @SuppressWarnings("unused")
        UUID userId = userProvider.getCurrentUser().getId();
        Dataset dataset = datasetRepository.findById(request.getDatasetId())
                .orElseThrow(() -> new RuntimeException("Dataset not found"));

        for (ChartDto dto : request.getCharts()) {
            Optional<Chart> existing = chartRepository.findByTitleAndChartTypeAndXFieldAndYField(
                            dto.getTitle(),
                            dto.getChartType(),
                            dto.getxField(),
                            dto.getyField());

            if (existing.isPresent()) {
                continue; // Skip saving duplicate
            }
            Chart chart = new Chart();
            chart.setChartType(dto.getChartType());
            chart.setxField(dto.getxField());
            chart.setyField(dto.getyField());
            chart.setTitle(dto.getTitle());
            chart.setDataset(dataset);
            chart.setOwner(dataset.getOwner());

            chartRepository.save(chart);
        }

        return ResponseEntity.ok("Charts saved");
    }

    @GetMapping
    public List<ChartDto> getChartsForDataset(@RequestParam UUID datasetId) {
        User user = userProvider.getCurrentUser();
        logger.info("Fetching charts for dataset {} and user {}", datasetId, user.getUsername());

        List<Chart> charts = chartRepository.findByDatasetIdAndOwnerId(datasetId, user.getId());

        return charts.stream()
                .map(c -> new ChartDto(c.getId(), c.getTitle(), c.getChartType(), c.getxField(), c.getyField()))
                .toList();
    }

    @DeleteMapping("/{chartId}")
public ResponseEntity<?> deleteChart(@PathVariable UUID chartId) {
    UUID userId = userProvider.getCurrentUser().getId();

    Chart chart = chartRepository.findById(chartId)
        .orElseThrow(() -> new RuntimeException("Chart not found"));

    // Only allow owner to delete
    if (!chart.getOwner().getId().equals(userId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
    }

    chartRepository.delete(chart);
    return ResponseEntity.ok("Chart deleted");
}
}