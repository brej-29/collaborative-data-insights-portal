package com.collabdata.backend.service;

import com.collabdata.backend.dto.CsvPreviewRow;
import com.collabdata.backend.dto.CsvUploadResponse;
import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.model.DatasetRow;
import com.collabdata.backend.model.User;
import com.collabdata.backend.repository.DatasetRepository;
import com.collabdata.backend.repository.DatasetRowRepository;
import com.collabdata.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReaderHeaderAware;
import org.springframework.transaction.annotation.Transactional;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.*;

@Service
public class DatasetUploadService {

    private final DatasetRepository datasetRepo;
    private final DatasetRowRepository rowRepo;
    private final UserRepository userRepo;

    public DatasetUploadService(DatasetRepository datasetRepo, DatasetRowRepository rowRepo, UserRepository userRepo) {
        this.datasetRepo = datasetRepo;
        this.rowRepo = rowRepo;
        this.userRepo = userRepo;
    }

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

    @Transactional
    public void saveFullDataset(MultipartFile file, String name, String description, String schemaJson, UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Versioning: check existing datasets with same name
        List<Dataset> existing = datasetRepo.findByOwner(user);
        int version = existing.stream()
                .filter(ds -> ds.getName().equalsIgnoreCase(name))
                .mapToInt(Dataset::getVersion)
                .max()
                .orElse(0) + 1;

        Dataset dataset = new Dataset();
        dataset.setOwner(user);
        dataset.setName(name);
        dataset.setDescription(description);
        dataset.setSchemaJson(schemaJson);
        dataset.setVersion(version);

        Dataset savedDataset = datasetRepo.save(dataset);

        try (CSVReaderHeaderAware reader = new CSVReaderHeaderAware(new InputStreamReader(file.getInputStream()))) {
            Map<String, String> row;
            while ((row = reader.readMap()) != null) {
                DatasetRow datasetRow = new DatasetRow();
                datasetRow.setDataset(savedDataset);
                datasetRow.setData(new ObjectMapper().writeValueAsString(row));
                rowRepo.save(datasetRow);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse and save CSV", e);
        }
    }
}
