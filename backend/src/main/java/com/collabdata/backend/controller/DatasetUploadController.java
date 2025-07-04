package com.collabdata.backend.controller;

import com.collabdata.backend.dto.CsvUploadResponse;
import com.collabdata.backend.service.DatasetUploadService;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/upload")
public class DatasetUploadController {
//@CrossOrigin(origins = "*", allowCredentials = "true")
    private final DatasetUploadService uploadService;

    public DatasetUploadController(DatasetUploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<CsvUploadResponse> uploadCsv(@RequestParam("file") MultipartFile file) {
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
        uploadService.saveFullDataset(file, name, description, schemaJson, userId);
        return ResponseEntity.ok("Dataset uploaded and saved successfully");
    }
}
