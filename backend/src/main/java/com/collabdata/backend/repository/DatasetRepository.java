package com.collabdata.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.model.User;
@Repository
public interface DatasetRepository extends JpaRepository<Dataset, UUID> {
    List<Dataset> findByOwner(User owner);
    List<Dataset> findByOwnerId(UUID ownerId);
}
