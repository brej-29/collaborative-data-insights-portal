package com.collabdata.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabdata.backend.model.DashboardChart;

@Repository
public interface DashboardChartRepository extends JpaRepository<DashboardChart, UUID> {
    List<DashboardChart> findByDashboardId(UUID dashboardId);
}

