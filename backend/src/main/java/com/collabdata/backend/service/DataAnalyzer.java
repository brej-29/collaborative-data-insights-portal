package com.collabdata.backend.service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


public class DataAnalyzer {

    public static Map<String, Object> summarize(List<Map<String, Object>> rows) {
        Map<String, List<Object>> columns = new HashMap<>();

        for (Map<String, Object> row : rows) {
            for (var entry : row.entrySet()) {
                columns.computeIfAbsent(entry.getKey(), k -> new ArrayList<>()).add(entry.getValue());
            }
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        for (var entry : columns.entrySet()) {
            String field = entry.getKey();
            List<Object> values = entry.getValue();
            long missing = values.stream().filter(Objects::isNull).count();
            boolean allNumeric = values.stream().allMatch(v -> v instanceof Number || isParsable(v));
            if (allNumeric) {
                List<Double> nums = values.stream().map(DataAnalyzer::parseAsDouble).filter(Objects::nonNull).toList();
                double sum = nums.stream().mapToDouble(Double::doubleValue).sum();
                double avg = sum / nums.size();
                double min = nums.stream().min(Double::compare).orElse(0.0);
                double max = nums.stream().max(Double::compare).orElse(0.0);

                summary.put(field, Map.of(
                    "type", "numeric",
                    "missing", missing,
                    "count", nums.size(),
                    "sum", sum,
                    "avg", avg,
                    "min", min,
                    "max", max
                ));
            } else {
                Map<String, Long> freq = values.stream()
                    .filter(Objects::nonNull)
                    .map(Object::toString)
                    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

                summary.put(field, Map.of(
                    "type", "categorical",
                    "missing", missing,
                    "distinct", freq.size(),
                    "top_values", freq.entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .limit(5)
                        .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            Map.Entry::getValue,
                            (e1, e2) -> e1,
                            LinkedHashMap::new
                        ))
                ));
            }
        }

        return summary;
    }

    private static boolean isParsable(Object v) {
        try {
            Double.parseDouble(String.valueOf(v));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static Double parseAsDouble(Object v) {
        try {
            return Double.parseDouble(String.valueOf(v));
        } catch (Exception e) {
            return null;
        }
    }
}
