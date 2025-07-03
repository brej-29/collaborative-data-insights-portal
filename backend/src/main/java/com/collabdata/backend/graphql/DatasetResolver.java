package com.collabdata.backend.graphql;

import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.model.User;
import com.collabdata.backend.repository.DatasetRepository;
import com.collabdata.backend.repository.UserRepository;

import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;

@Controller
public class DatasetResolver {
    private final DatasetRepository datasetRepo;
    private final UserRepository userRepo;
    private static final Logger logger = LoggerFactory.getLogger(DatasetResolver.class);

    public DatasetResolver(DatasetRepository datasetRepo, UserRepository userRepo) {
        this.datasetRepo = datasetRepo;
        this.userRepo = userRepo;
    }

    @QueryMapping
    public List<Dataset> datasetsByUser(@Argument UUID userId) {
        return userRepo.findById(userId)
                .map(user -> datasetRepo.findByOwner(user))
                .orElse(List.of());
    }

    @MutationMapping
    public Dataset createDataset(@Argument UUID userId,
                                @Argument String name,
                                @Argument String description,
                                @Argument String schemaJson) {
        logger.info("Creating dataset for userId: {}", userId);

        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Dataset dataset = new Dataset();
        dataset.setOwner(user);
        dataset.setName(name);
        dataset.setDescription(description);
        dataset.setSchemaJson(schemaJson);
        logger.info("Saving dataset: {}", dataset.getName());

        return datasetRepo.save(dataset);
    }
}
