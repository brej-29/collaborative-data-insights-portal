package com.collabdata.backend.repository;
import com.collabdata.backend.model.Chart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ChartRepository extends JpaRepository<Chart, UUID> {
}