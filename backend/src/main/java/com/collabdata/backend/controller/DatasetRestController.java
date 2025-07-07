package com.collabdata.backend.controller;

import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.repository.DatasetRepository;
import com.collabdata.backend.security.LoggedInUserProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/datasets")
public class DatasetRestController {

    private static final Logger logger = LoggerFactory.getLogger(DatasetRestController.class);
    private final DatasetRepository datasetRepository;
    private final LoggedInUserProvider userProvider;

    public DatasetRestController(DatasetRepository datasetRepository, LoggedInUserProvider userProvider) {
        this.datasetRepository = datasetRepository;
        this.userProvider = userProvider;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Dataset> getAllDatasetsForUser() {
        UUID userId = userProvider.getCurrentUser().getId();
        logger.info("Fetching datasets for user {}", userId);
        return datasetRepository.findByOwnerId(userId);
    }
}
