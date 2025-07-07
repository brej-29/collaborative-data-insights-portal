import React, { useEffect, useState } from "react";
import api from "../api/axios";
import ChartBlock from "../components/ChartBlock";
import { getChartSuggestions } from "../ai/openRouter";
import { buildPrompt } from "../ai/promptBuilder";

interface ChartConfig {
  chartType: string;
  xField: string;
  yField: string;
  title: string;
  data: Record<string, any>[];
}

interface Dataset {
  id: string;
  name: string;
  description: string;
}

export default function Dashboard() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [selectedDatasetData, setSelectedDatasetData] = useState<Record<string, any>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [charts, setCharts] = useState<ChartConfig[]>([]);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await api.get("/datasets");
        setDatasets(res.data);
      } catch (err) {
        console.error("Failed to fetch datasets", err);
      }
    };

    fetchDatasets();
  }, []);

  const handleDatasetSelect = async (id: string) => {
    setSelectedDatasetId(id);
    try {
      const res = await api.get(`/datasets/${id}/rows`);
      setSelectedDatasetData(res.data.slice(0, 100));
    } catch (err) {
      console.error("Failed to fetch dataset rows", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="mb-6 space-y-2">
        <label className="block font-semibold">Select a dataset</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedDatasetId || ""}
          onChange={(e) => handleDatasetSelect(e.target.value)}
        >
          <option value="">-- Choose Dataset --</option>
          {datasets.map((ds) => (
            <option key={ds.id} value={ds.id}>
              {ds.name}
            </option>
          ))}
        </select>
      </div>

      {selectedDatasetId && (
        <div className="mb-6 space-x-4">
          <button
            onClick={async () => {
  if (!selectedDatasetData.length) return;
  const prompt = buildPrompt(Object.keys(selectedDatasetData[0]), selectedDatasetData);
  try {
    const aiCharts = await getChartSuggestions(prompt);
    setCharts(aiCharts); // Add to dashboard
  } catch (err) {
    alert("AI failed to generate charts.");
  }
}}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            🧠 Auto-Generate Dashboard (AI)
          </button>
          <button
            onClick={() => console.log("TODO: Enter manual builder mode")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ✍️ Build Dashboard Manually
          </button>
        </div>
      )}

      {/* Preview Sample Data */}
      {selectedDatasetData.length > 0 && (
        <pre className="text-xs bg-gray-100 p-2 rounded max-h-64 overflow-y-auto">
          {JSON.stringify(selectedDatasetData.slice(0, 5), null, 2)}
        </pre>
      )}

      {/* Placeholder for future chart rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {charts.map((config, index) => (
          <ChartBlock key={index} config={config} />
        ))}
      </div>
    </div>
  );
}
