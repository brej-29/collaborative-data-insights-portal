package com.collabdata.backend.controller;

import com.collabdata.backend.dto.CsvUploadResponse;
import com.collabdata.backend.service.DatasetUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class DatasetUploadController {

    private final DatasetUploadService uploadService;

    public DatasetUploadController(DatasetUploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<CsvUploadResponse> uploadCsv(@RequestParam("file") MultipartFile file) {
        CsvUploadResponse result = uploadService.handleCsvUpload(file);
        return ResponseEntity.ok(result);
    }
}
