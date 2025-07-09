package com.collabdata.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.model.DatasetRow;
@Repository
public interface DatasetRowRepository extends JpaRepository<DatasetRow, UUID> {
    List<DatasetRow> findByDataset(Dataset dataset);
    List<DatasetRow> findByDatasetId(UUID datasetId);
}
