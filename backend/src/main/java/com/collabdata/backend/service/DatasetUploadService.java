package com.collabdata.backend.service;

import com.collabdata.backend.dto.CsvUploadResponse;
import com.collabdata.backend.dto.CsvPreviewRow;
import com.opencsv.CSVReaderHeaderAware;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.*;

@Service
public class DatasetUploadService {

    public CsvUploadResponse handleCsvUpload(MultipartFile file) {
        List<CsvPreviewRow> preview = new ArrayList<>();
        Set<String> headers = new LinkedHashSet<>();

        try (CSVReaderHeaderAware reader = new CSVReaderHeaderAware(new InputStreamReader(file.getInputStream()))) {
            for (int i = 0; i < 50; i++) {
                Map<String, String> row = reader.readMap();
                if (row == null) break;
                headers.addAll(row.keySet());
                preview.add(new CsvPreviewRow(row));
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV", e);
        }

        return new CsvUploadResponse("Upload successful", new ArrayList<>(headers), preview);
    }
}
