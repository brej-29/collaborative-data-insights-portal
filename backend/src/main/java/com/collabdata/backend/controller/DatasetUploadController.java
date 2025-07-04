package com.collabdata.backend.controller;

import com.collabdata.backend.dto.CsvUploadResponse;
import com.collabdata.backend.service.DatasetUploadService;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class DatasetUploadController {
    // @CrossOrigin(origins = "*", allowCredentials = "true")
    private static final Logger logger = LoggerFactory.getLogger(DatasetUploadController.class);

    private final DatasetUploadService uploadService;

    public DatasetUploadController(DatasetUploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<CsvUploadResponse> uploadCsv(@RequestParam("file") MultipartFile file) {
        logger.info("📤 Received request to preview CSV file: {}", file.getOriginalFilename());
        CsvUploadResponse result = uploadService.handleCsvUpload(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/persist")
    public ResponseEntity<String> uploadAndPersistDataset(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("schemaJson") String schemaJson,
            @RequestParam("userId") UUID userId) {
        logger.info("📥 Received request to save dataset for user {}", userId);
        uploadService.saveFullDataset(file, name, description, schemaJson, userId);
        return ResponseEntity.ok("Dataset uploaded and saved successfully");
    }
}
