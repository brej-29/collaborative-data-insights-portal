import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { getChartSuggestions } from "../ai/openRouter";
import { buildPrompt } from "../ai/promptBuilder";
import EditableChartBlock from "../components/EditableChartBlock";
import DataSummary from "../components/DataSummary";
import useWebSocket from "../hooks/useWebSocket";
import { v4 as uuidv4 } from "uuid";
interface ChartConfig {
  chartId: string;
  chartType:
    | "bar"
    | "line"
    | "pie"
    | "doughnut"
    | "scatter"
    | "area"
    | "radar"
    | "histogram";
  xField: string;
  yField?: string | null;
  title: string;
  data: Record<string, any>[];
  dataInfo?: {
    used: number;
    total: number;
  };
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
  const [manualChartType, setManualChartType] = useState<ChartConfig["chartType"]>("bar");
  const [manualXField, setManualXField] = useState<string>("");
  const [manualYField, setManualYField] = useState<string>("");
  const [manualTitle, setManualTitle] = useState<string>("");
  const [dataSummary, setDataSummary] = useState<Record<string, any> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sendMessage } = useWebSocket((msg) => {
    const update = JSON.parse(msg.body);
    console.log("📡 Real-time update received:", update);
    // TODO: Apply update to state (e.g., update chart, show toast, etc.)
  });


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
    const parsedRows = res.data
      .slice(0, 100)
      .map((r: any) => JSON.parse(r.data));
    setSelectedDatasetData(parsedRows);

    // 🔍 ADD THIS to fetch data summary
    const summaryRes = await api.get(`/analysis/${id}/summary`);
    setDataSummary(summaryRes.data);

    // ✅ 3. Fetch saved charts
    const chartRes = await api.get(`/charts?datasetId=${id}`);
    const loadedCharts = chartRes.data.map((c: any) => ({
      chartId: c.id,
      chartType: c.chartType,
      title: c.title,
      xField: c.xField,
      yField: c.yField,
      data: parsedRows, // Attach fresh data
      dataInfo: {
        used: parsedRows.length,
        total: parsedRows.length,
      },
    }));

    // 4. Update chart state
    setCharts(loadedCharts);

  } catch (err) {
    console.error("⚠️ Failed to load dataset or summary", err);
  alert("Failed to load dataset or summary. Please try again later.");
  }
};

const handleSaveCharts = async () => {
  if (!selectedDatasetId || !charts.length) return;

  try {
    await api.post("/charts/save", {
      datasetId: selectedDatasetId,
      charts: charts.map(({ chartType, xField, yField, title }) => ({
        chartType,
        xField,
        yField,
        title,
      })),
    });

    alert("✅ Charts saved to backend!");
  } catch (err) {
    console.error("Error saving charts", err);
    alert("❌ Failed to save charts");
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
  if (!selectedDatasetData.length || !selectedDatasetId) return;

  try {
    const summaryRes = await api.get(`/analysis/${selectedDatasetId}/summary`);
    const prompt = buildPrompt(
      Object.keys(selectedDatasetData[0]),
      selectedDatasetData.slice(0, 3),
      summaryRes.data
    );


    const aiCharts = await getChartSuggestions(prompt);

    const enrichedCharts = aiCharts.map((chart: any) => ({
      ...chart,
      chartId: uuidv4(),
      data: selectedDatasetData,
      dataInfo: {
        used: selectedDatasetData.length,
        total: selectedDatasetData.length,
      },
    }));

    setCharts(enrichedCharts);
  } catch (err) {
    console.error("AI generation error:", err);
    alert("⚠️ AI failed. Try again or check logs.");
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

      {selectedDatasetData.length > 0 && (
  <div className="border rounded p-4 mt-4 bg-white shadow-sm">
    <h3 className="text-lg font-semibold mb-2">🛠️ Build Your Own Chart</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium">Chart Type</label>
        <select
          className="border rounded w-full p-2"
          value={manualChartType}
          onChange={(e) => setManualChartType(e.target.value as ChartConfig["chartType"])}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
          <option value="doughnut">Doughnut</option>
          <option value="scatter">Scatter</option>
          <option value="area">Area</option>
          <option value="radar">Radar</option>
          <option value="histogram">Histogram</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">X Axis Field</label>
        <select
          className="border rounded w-full p-2"
          value={manualXField}
          onChange={(e) => setManualXField(e.target.value)}
        >
          <option value="">-- Choose Field --</option>
          {selectedDatasetData.length > 0 &&
            Object.keys(selectedDatasetData[0]).map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
        </select>
      </div>

      {manualChartType !== "pie" && (
        <div>
          <label className="block text-sm font-medium">Y Axis Field</label>
          <select
            className="border rounded w-full p-2"
            value={manualYField}
            onChange={(e) => setManualYField(e.target.value)}
          >
            <option value="">-- Choose Field --</option>
            {selectedDatasetData.length > 0 &&
              Object.keys(selectedDatasetData[0]).map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium">Chart Title</label>
      <input
        className="border rounded w-full p-2"
        type="text"
        value={manualTitle}
        onChange={(e) => setManualTitle(e.target.value)}
      />
    </div>

    <div className="flex gap-4">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => {
          const newChart = {
            chartId: uuidv4(),
            chartType: manualChartType,
            xField: manualXField,
            yField: manualChartType === "pie" ? null : manualYField,
            title: manualTitle,
            data: selectedDatasetData,
            dataInfo: {
              used: selectedDatasetData.length,
              total: selectedDatasetData.length,
            },
          };
          setCharts((prev) => [...prev, newChart]);
        }}
        disabled={!manualXField || (manualChartType !== "pie" && !manualYField)}
      >
        ➕ Add Chart to Dashboard
      </button>
    </div>
  </div>
)}

      {dataSummary && <DataSummary summary={dataSummary} />}

      {/* Preview Sample Data */}
      {selectedDatasetData.length > 0 && (
  <div className="bg-white p-4 rounded shadow mt-6">
    <button
      onClick={() => setShowPreview((prev) => !prev)}
      className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
    >
      {showPreview ? "🔽 Hide" : "▶️ Show"} Preview Sample Data
    </button>

    {showPreview && (
      <pre className="text-xs bg-gray-100 p-3 rounded mt-4 max-h-64 overflow-y-auto">
        {JSON.stringify(selectedDatasetData.slice(0, 5), null, 2)}
      </pre>
    )}
  </div>
)}


      {/* Placeholder for future chart rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
  {charts.map((config, index) => (
  <EditableChartBlock
    key={index}
    config={config}
    onUpdate={(newConfig) => {
      const updated = [...charts];
      updated[index] = newConfig;
      setCharts(updated);
    }}
    onDelete={async () => {
  const chartToDelete = charts[index];

  // Check if it has a chartId → only saved charts have it
  if (chartToDelete.chartId) {
    try {
      await api.delete(`/charts/${chartToDelete.chartId}`);
    } catch (err) {
      console.error("❌ Failed to delete chart from backend:", err);
      alert("Failed to delete chart from server.");
    }
  }

  // Always remove from local state
  const updated = [...charts];
  updated.splice(index, 1);
  setCharts(updated);
}}
  />
))}
</div>
{/* 💾 Save Button */}
{charts.length > 0 && (
  <div className="mt-6 text-right">
    <button
      onClick={handleSaveCharts}
      className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
    >
      💾 Save Charts to Backend
    </button>
  </div>
)}

    </div>
  );
}
