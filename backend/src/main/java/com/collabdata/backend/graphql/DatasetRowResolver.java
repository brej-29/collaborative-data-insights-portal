package com.collabdata.backend.graphql;

import java.util.List;
import java.util.UUID;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.collabdata.backend.model.Dataset;
import com.collabdata.backend.model.DatasetRow;
import com.collabdata.backend.repository.DatasetRepository;
import com.collabdata.backend.repository.DatasetRowRepository;

@Controller
public class DatasetRowResolver {
    private final DatasetRowRepository rowRepo;
    private final DatasetRepository datasetRepo;

    public DatasetRowResolver(DatasetRowRepository rowRepo, DatasetRepository datasetRepo) {
        this.rowRepo = rowRepo;
        this.datasetRepo = datasetRepo;
    }

    @QueryMapping
    public List<DatasetRow> datasetRows(@Argument UUID datasetId) {
        return datasetRepo.findById(datasetId)
                .map(rowRepo::findByDataset)
                .orElse(List.of());
    }

    @MutationMapping
    public DatasetRow addDatasetRow(@Argument UUID datasetId, 
                                    @Argument String data) {
        Dataset dataset = datasetRepo.findById(datasetId).orElseThrow();
        DatasetRow row = new DatasetRow();
        row.setDataset(dataset);
        row.setData(data);
        return rowRepo.save(row);
    }
}
