package com.collabdata.backend.controller;

import com.collabdata.backend.dto.DatasetRowDto;
import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.repository.DatasetRepository;
import com.collabdata.backend.repository.DatasetRowRepository;
import com.collabdata.backend.security.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/datasets")
public class DatasetRestController {

    private static final Logger logger = LoggerFactory.getLogger(DatasetRestController.class);
    private final DatasetRepository datasetRepository;
    private final DatasetRowRepository datasetRowRepository;

    public DatasetRestController(DatasetRepository datasetRepository,
            DatasetRowRepository datasetRowRepository) {
        this.datasetRepository = datasetRepository;
        this.datasetRowRepository = datasetRowRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Dataset> getAllDatasetsForUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID userId = userDetails.getUser().getId();
        logger.info("Fetching datasets for user {}", userId);
        return datasetRepository.findByOwnerId(userId);
    }

    @GetMapping("/{datasetId}/rows")
    @Transactional(readOnly = true)
    public List<DatasetRowDto> getRowsForDataset(@PathVariable UUID datasetId) {
        logger.info("Fetching rows for dataset {}", datasetId);
        return datasetRowRepository.findByDatasetId(datasetId).stream()
                .map(DatasetRowDto::fromEntity)
                .collect(Collectors.toList());
    }

}
