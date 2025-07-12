package com.collabdata.backend.controller;

import com.collabdata.backend.repository.DatasetRowRepository;
import com.collabdata.backend.service.DataAnalyzer;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.collabdata.backend.model.DatasetRow;

@RestController
@RequestMapping("/api/analysis")
public class DatasetAnalysisController {

    private final DatasetRowRepository rowRepo;
    private final ObjectMapper objectMapper;
    private static final Logger logger = LoggerFactory.getLogger(DatasetAnalysisController.class);

    public DatasetAnalysisController(DatasetRowRepository rowRepo, ObjectMapper objectMapper) {
        this.rowRepo = rowRepo;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/{datasetId}/summary")
    public ResponseEntity<Map<String, Object>> summarize(@PathVariable UUID datasetId) {
        logger.info("📊 Starting summary analysis for dataset {}", datasetId);
        try {
            List<DatasetRow> rows = rowRepo.findByDatasetId(datasetId);
            if (rows.isEmpty()) {
                logger.warn("❗ No rows found for dataset {}", datasetId);
                return ResponseEntity.notFound().build();
            }

            List<Map<String, Object>> parsedRows = rows.stream().map(r -> {
                try {
                    return objectMapper.readValue(r.getData(), new TypeReference<Map<String, Object>>() {});
                } catch (Exception e) {
                    logger.error("⚠️ Failed to parse dataset row {}", r.getId(), e);
                    return Map.<String, Object>of();
                }
            }).toList();

            Map<String, Object> result = DataAnalyzer.summarize(parsedRows);
            logger.info("✅ Summary completed for dataset {}", datasetId);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.error("🔥 Unexpected error in summarizing dataset {}", datasetId, e);
            return ResponseEntity.status(500).body(Map.of("error", "Internal error occurred"));
        }
    }
}
