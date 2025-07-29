package com.collabdata.backend.repository;
import com.collabdata.backend.model.Chart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChartRepository extends JpaRepository<Chart, UUID> {
    List<Chart> findByDatasetIdAndOwnerId(UUID datasetId, UUID ownerId);
    Optional<Chart> findByTitleAndChartTypeAndXFieldAndYField(
    String title,
    String chartType,
    String xField,
    String yField
);

}