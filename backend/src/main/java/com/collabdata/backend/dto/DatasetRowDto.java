package com.collabdata.backend.dto;

import java.util.UUID;

import com.collabdata.backend.model.DatasetRow;

public record DatasetRowDto(UUID id, String data) {
    public static DatasetRowDto fromEntity(DatasetRow row) {
        return new DatasetRowDto(row.getId(), row.getData());
    }
}
