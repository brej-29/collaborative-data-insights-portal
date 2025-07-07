package com.collabdata.backend.repository;

import com.collabdata.backend.model.Dashboard;
import com.collabdata.backend.model.User;
import com.collabdata.backend.model.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DashboardRepository extends JpaRepository<Dashboard, UUID> {
    List<Dashboard> findByOwner(User user);
    List<Dashboard> findByDataset(Dataset dataset);
}
